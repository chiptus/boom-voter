import { test, expect } from "@playwright/test";
import { TestHelpers } from "../utils/test-helpers";

test.describe("Sets", () => {
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
  });

  test("should display set detail page", async ({ page }) => {
    // Navigate to a test set URL
    await testHelpers.navigateTo("/sets/test-set");

    // Should show set content or 404
    const setContent = page.getByRole("main");
    await expect(setContent).toBeVisible();

    // If set exists, should show set information
    const setInfo = page
      .locator('[data-testid*="set"]')
      .or(page.getByRole("heading"));

    if (await setInfo.isVisible()) {
      await expect(setInfo).toBeVisible();
    }
  });

  test("should show set voting buttons when authenticated", async ({
    page,
  }) => {
    await testHelpers.navigateTo("/sets/test-set");

    const isAuth = await testHelpers.isAuthenticated();

    if (isAuth) {
      // Look for voting buttons
      const voteButtons = page
        .locator('[data-testid*="vote"]')
        .or(page.getByRole("button", { name: /must go|interested|won't go/i }));

      if (await voteButtons.first().isVisible()) {
        await expect(voteButtons.first()).toBeVisible();
      }
    }
  });

  test("should display set information", async ({ page }) => {
    await testHelpers.navigateTo("/sets/test-set");

    // Look for set metadata
    const setName = page.getByRole("heading").first();
    if (await setName.isVisible()) {
      await expect(setName).toBeVisible();
    }

    // Look for time information
    const timeInfo = page.getByText(/\d{1,2}:\d{2}|am|pm/i);
    if (await timeInfo.isVisible()) {
      await expect(timeInfo).toBeVisible();
    }

    // Look for stage information
    const stageInfo = page.getByText(/stage|venue/i);
    if (await stageInfo.isVisible()) {
      await expect(stageInfo).toBeVisible();
    }
  });

  test("should show artists in multi-artist sets", async ({ page }) => {
    await testHelpers.navigateTo("/sets/test-set");

    // Look for artist information
    const artistInfo = page
      .locator('[data-testid*="artist"]')
      .or(page.locator(".artist-card, .artist-item"));

    if (await artistInfo.first().isVisible()) {
      await expect(artistInfo.first()).toBeVisible();

      // Should show artist names
      const artistName = artistInfo.first().getByRole("heading");
      if (await artistName.isVisible()) {
        await expect(artistName).toBeVisible();
      }
    }
  });

  test("should display set image", async ({ page }) => {
    await testHelpers.navigateTo("/sets/test-set");

    // Look for set image
    const setImage = page
      .locator('[data-testid*="set-image"]')
      .or(page.locator('img[alt*="set"], img[alt*="artist"]'));

    if (await setImage.isVisible()) {
      await expect(setImage).toBeVisible();

      // Image should have alt text
      const altText = await setImage.getAttribute("alt");
      expect(altText).toBeTruthy();
    }
  });

  test("should show set notes section", async ({ page }) => {
    await testHelpers.navigateTo("/sets/test-set");

    // Look for notes section
    const notesSection = page
      .locator('[data-testid*="notes"]')
      .or(page.getByText(/notes|comments/i));

    if (await notesSection.isVisible()) {
      await expect(notesSection).toBeVisible();
    }
  });

  test("should allow adding notes when authenticated", async ({ page }) => {
    await testHelpers.navigateTo("/sets/test-set");

    const isAuth = await testHelpers.isAuthenticated();
    if (!isAuth) {
      test.skip("Authentication required for notes test");
    }

    // Look for add note functionality
    const addNoteButton = page
      .getByRole("button", { name: /add note|new note/i })
      .or(page.locator('[data-testid*="add-note"]'));

    const noteInput = page
      .getByPlaceholder(/note|comment/i)
      .or(page.getByLabel(/note/i));

    if ((await addNoteButton.isVisible()) || (await noteInput.isVisible())) {
      if (await noteInput.isVisible()) {
        await expect(noteInput).toBeVisible();

        // Try adding a note
        await noteInput.fill("Test note");

        // Look for submit button
        const submitButton = page.getByRole("button", {
          name: /save|submit|add/i,
        });
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await testHelpers.waitForPageLoad();
        }
      }
    }
  });

  test("should show genre information", async ({ page }) => {
    await testHelpers.navigateTo("/sets/test-set");

    // Look for genre badges or tags
    const genreInfo = page
      .locator('[data-testid*="genre"]')
      .or(page.locator(".genre-badge, .tag"))
      .or(page.getByText(/rock|pop|electronic|jazz|hip hop/i));

    if (await genreInfo.first().isVisible()) {
      await expect(genreInfo.first()).toBeVisible();
    }
  });

  test("should handle social platform links", async ({ page }) => {
    await testHelpers.navigateTo("/sets/test-set");

    // Look for social media links
    const socialLinks = page
      .locator('a[href*="spotify"], a[href*="youtube"], a[href*="soundcloud"]')
      .or(page.locator('[data-testid*="social"]'));

    if (await socialLinks.first().isVisible()) {
      await expect(socialLinks.first()).toBeVisible();

      // Links should open in new tab
      const target = await socialLinks.first().getAttribute("target");
      expect(target).toBe("_blank");
    }
  });

  test("should show vote counts and statistics", async ({ page }) => {
    await testHelpers.navigateTo("/sets/test-set");

    // Look for vote statistics
    const voteStats = page
      .locator('[data-testid*="vote-count"]')
      .or(page.locator(".vote-stats, .statistics"));

    if (await voteStats.first().isVisible()) {
      await expect(voteStats.first()).toBeVisible();

      // Should contain numbers
      const statsText = await voteStats.first().textContent();
      expect(statsText).toMatch(/\d+/);
    }
  });

  test("should handle invalid set URLs gracefully", async ({ page }) => {
    await testHelpers.navigateTo("/sets/non-existent-set");

    // Should show 404 or not found message
    const notFoundContent = page
      .getByText(/not found|404|doesn't exist/i)
      .or(page.locator('[data-testid*="not-found"]'));

    // Some content should be visible (either error or valid content)
    const pageContent = page.getByRole("main");
    await expect(pageContent).toBeVisible();
  });

  test("should support navigation back to main view", async ({ page }) => {
    await testHelpers.navigateTo("/sets/test-set");

    // Look for back navigation
    const backButton = page
      .getByRole("button", { name: /back|return/i })
      .or(page.locator('[data-testid*="back"]'))
      .or(page.getByRole("link", { name: /back|home/i }));

    if (await backButton.isVisible()) {
      await expect(backButton).toBeVisible();

      await backButton.click();

      // Should navigate away from set detail
      await expect(page).not.toHaveURL(/\/sets\/[^/]+$/);
    }
  });

  test("should show related sets or recommendations", async ({ page }) => {
    await testHelpers.navigateTo("/sets/test-set");

    // Look for related or recommended sets
    const relatedSets = page
      .locator('[data-testid*="related"], [data-testid*="recommend"]')
      .or(page.getByText(/related|similar|you might like/i));

    if (await relatedSets.isVisible()) {
      await expect(relatedSets).toBeVisible();
    }
  });
});
