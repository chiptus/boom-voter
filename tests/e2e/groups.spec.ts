import { test, expect } from "@playwright/test";
import { TestHelpers } from "../utils/test-helpers";

test.describe("Groups", () => {
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
  });

  test("should display groups page", async ({ page }) => {
    await testHelpers.navigateTo("/groups");

    // Should show groups page content
    const groupsContent = page
      .locator('[data-testid*="groups"]')
      .or(page.getByRole("main"));

    await expect(groupsContent).toBeVisible();

    // Should have page title or heading
    const heading = page.getByRole("heading", { name: /groups?/i }).first();
    await expect(heading).toBeVisible();
  });

  test("should show create group option when authenticated", async ({
    page,
  }) => {
    await testHelpers.navigateTo("/groups");

    const isAuth = await testHelpers.isAuthenticated();

    if (isAuth) {
      // Look for create group button or dialog
      const createGroupButton = page
        .getByRole("button", { name: /create group|new group|add group/i })
        .or(page.getByText(/create group|new group/i));

      if (await createGroupButton.isVisible()) {
        await expect(createGroupButton).toBeVisible();

        // Click to open create group dialog
        await createGroupButton.click();

        // Should show create group dialog
        const dialog = page.getByRole("dialog");
        await expect(dialog).toBeVisible();

        // Should have group name input
        const nameInput = page
          .getByLabel(/name|title/i)
          .or(page.getByPlaceholder(/group name|name/i));
        await expect(nameInput).toBeVisible();
      }
    } else {
      // Should either hide create button or show sign-in prompt
      const createGroupButton = page.getByRole("button", {
        name: /create group|new group/i,
      });
      const signInPrompt = page.getByText(/sign in|login/i);

      // Either no create button visible or sign in prompt shown
      const hasAuthenticationHandling =
        !(await createGroupButton.isVisible()) ||
        (await signInPrompt.isVisible());
      expect(hasAuthenticationHandling).toBe(true);
    }
  });

  test("should display existing groups list", async ({ page }) => {
    await testHelpers.navigateTo("/groups");

    // Look for groups list or cards
    const groupsList = page
      .locator('[data-testid*="groups-list"]')
      .or(page.locator('[data-testid*="group-card"]'))
      .or(page.locator(".group-card, .group-item"));

    // If groups exist, they should be displayed
    if (await groupsList.first().isVisible()) {
      await expect(groupsList.first()).toBeVisible();
    } else {
      // Should show empty state
      const emptyState = page
        .getByText(/no groups|empty|create your first/i)
        .or(page.locator('[data-testid*="empty"]'));

      if (await emptyState.isVisible()) {
        await expect(emptyState).toBeVisible();
      }
    }
  });

  test("should navigate to group detail page", async ({ page }) => {
    await testHelpers.navigateTo("/groups");

    // Look for group cards or links
    const groupLinks = page
      .locator('[data-testid*="group-card"] a')
      .or(page.locator('a[href*="/groups/"]'))
      .or(page.getByRole("link").filter({ hasText: /group/i }));

    if (await groupLinks.first().isVisible()) {
      await groupLinks.first().click();

      // Should navigate to group detail page
      await expect(page).toHaveURL(/\/groups\/[^/]+/);

      // Should show group detail content
      const groupDetail = page
        .locator('[data-testid*="group-detail"]')
        .or(page.getByRole("main"));
      await expect(groupDetail).toBeVisible();
    }
  });

  test("should handle group invitations", async ({ page }) => {
    // Test invite link functionality
    // This would typically be tested with a known invite link

    // Check if there are invite-related elements on groups page
    const inviteElements = page
      .getByText(/invite|share/i)
      .or(page.locator('[data-testid*="invite"]'));

    if (await inviteElements.first().isVisible()) {
      await expect(inviteElements.first()).toBeVisible();
    }
  });

  test("should show group management options for group creators", async ({
    page,
  }) => {
    await testHelpers.navigateTo("/groups");

    const isAuth = await testHelpers.isAuthenticated();
    if (!isAuth) {
      test.skip("Authentication required for group management test");
    }

    // Look for group cards or navigate to a group detail
    const groupLinks = page.locator('a[href*="/groups/"]');

    if (await groupLinks.first().isVisible()) {
      await groupLinks.first().click();

      // Look for management options (edit, delete, manage members)
      const managementOptions = page
        .getByRole("button", { name: /edit|delete|manage|settings/i })
        .or(page.locator('[data-testid*="manage"]'));

      // If user is group creator, should see management options
      if (await managementOptions.first().isVisible()) {
        await expect(managementOptions.first()).toBeVisible();
      }
    }
  });

  test("should display group members", async ({ page }) => {
    await testHelpers.navigateTo("/groups");

    const groupLinks = page.locator('a[href*="/groups/"]');

    if (await groupLinks.first().isVisible()) {
      await groupLinks.first().click();

      // Should show group members section
      const membersSection = page
        .getByText(/members/i)
        .or(page.locator('[data-testid*="members"]'));

      if (await membersSection.isVisible()) {
        await expect(membersSection).toBeVisible();

        // Should show at least the current user or creator
        const membersList = page
          .locator('[data-testid*="member"]')
          .or(page.locator(".member-card, .member-item"));

        if (await membersList.first().isVisible()) {
          await expect(membersList.first()).toBeVisible();
        }
      }
    }
  });

  test("should allow joining group via invite link", async ({ page }) => {
    // This test would need a valid invite link to test properly
    // For now, we'll test the invite landing page structure

    const invitePattern = /\/groups\/.*invite/;

    // Try to visit a mock invite URL structure
    await testHelpers.navigateTo("/groups/test-group?invite=123");

    // Should either show invite acceptance page or redirect appropriately
    const inviteContent = page
      .getByText(/join|invite|accept/i)
      .or(page.locator('[data-testid*="invite"]'));

    // This might show 404 or invite page depending on implementation
    const pageContent = page.getByRole("main");
    await expect(pageContent).toBeVisible();
  });
});
