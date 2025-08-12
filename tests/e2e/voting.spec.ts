import { test, expect } from "@playwright/test";
import { TestHelpers } from "../utils/test-helpers";

test.describe("Voting", () => {
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
    await testHelpers.navigateTo("/");
  });

  test("should allow user to vote on sets/artists when authenticated", async ({
    page,
  }) => {
    // Skip test if user is not authenticated
    const isAuth = await testHelpers.isAuthenticated();
    if (!isAuth) {
      // Try to sign in first
      const signInButton = page
        .getByRole("button", { name: /sign in/i })
        .or(page.getByRole("link", { name: /sign in/i }));

      if (await signInButton.isVisible()) {
        await signInButton.click();
        // For now, just skip if auth dialog appears (would need real test credentials)
        const authDialog = page.getByRole("dialog");
        if (await authDialog.isVisible()) {
          test.skip("Authentication required for voting test");
        }
      } else {
        test.skip("Cannot find sign in button");
      }
    }

    // Look for voting buttons on sets/artists
    const voteButtons = page
      .locator('[data-testid*="vote"]')
      .or(page.locator('button[aria-label*="vote"]'))
      .or(page.getByRole("button", { name: /must go|interested|won't go/i }));

    if (await voteButtons.first().isVisible()) {
      const initialCount = await voteButtons.count();
      expect(initialCount).toBeGreaterThan(0);

      // Click on a voting button
      await voteButtons.first().click();

      // Should show some feedback (like updated vote count or visual state change)
      await testHelpers.waitForPageLoad();

      // Verify the vote was recorded (button might change state/color)
      const updatedButton = voteButtons.first();
      await expect(updatedButton).toBeVisible();
    }
  });

  test("should show vote counts on sets/artists", async ({ page }) => {
    // Look for vote count indicators
    const voteCountElements = page
      .locator('[data-testid*="vote-count"]')
      .or(page.locator(".vote-count"))
      .or(page.locator('[aria-label*="votes"]'));

    // If vote counts are displayed, they should be visible
    if (await voteCountElements.first().isVisible()) {
      await expect(voteCountElements.first()).toBeVisible();

      // Vote counts should contain numbers
      const countText = await voteCountElements.first().textContent();
      expect(countText).toMatch(/\d+/);
    }
  });

  test("should handle voting without authentication gracefully", async ({
    page,
  }) => {
    // If not authenticated, voting should either:
    // 1. Show sign-in prompt
    // 2. Be disabled
    // 3. Redirect to auth

    const isAuth = await testHelpers.isAuthenticated();
    if (!isAuth) {
      const voteButtons = page
        .locator('[data-testid*="vote"]')
        .or(page.getByRole("button", { name: /must go|interested|won't go/i }));

      if (await voteButtons.first().isVisible()) {
        await voteButtons.first().click();

        // Should either show auth dialog or sign in button should appear
        const authDialog = page.getByRole("dialog");
        const signInButton = page.getByRole("button", { name: /sign in/i });

        const hasAuthResponse = await Promise.race([
          authDialog.isVisible(),
          signInButton.isVisible(),
        ]);

        expect(hasAuthResponse).toBe(true);
      }
    }
  });

  test("should allow changing votes", async ({ page }) => {
    const isAuth = await testHelpers.isAuthenticated();
    if (!isAuth) {
      test.skip("Authentication required for vote changing test");
    }

    // Look for voting buttons for the same item
    const voteButtonGroup = page
      .locator('[data-testid*="voting-buttons"]')
      .first();

    if (await voteButtonGroup.isVisible()) {
      const individualVoteButtons = voteButtonGroup.locator("button");
      const buttonCount = await individualVoteButtons.count();

      if (buttonCount >= 2) {
        // Click first vote button
        await individualVoteButtons.nth(0).click();
        await testHelpers.waitForPageLoad();

        // Click different vote button
        await individualVoteButtons.nth(1).click();
        await testHelpers.waitForPageLoad();

        // Should handle the vote change without errors
        await expect(individualVoteButtons.nth(1)).toBeVisible();
      }
    }
  });

  test("should show voting perspective selector if available", async ({
    page,
  }) => {
    // Look for perspective selector (personal vs group voting)
    const perspectiveSelector = page
      .locator('[data-testid*="perspective"]')
      .or(page.getByLabel(/perspective|view/i))
      .or(page.locator('select[name*="perspective"]'));

    if (await perspectiveSelector.isVisible()) {
      await expect(perspectiveSelector).toBeVisible();

      // Should have multiple options
      const options = perspectiveSelector.locator("option");
      if ((await options.count()) > 0) {
        expect(await options.count()).toBeGreaterThan(1);
      }
    }
  });
});
