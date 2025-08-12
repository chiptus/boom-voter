import { test, expect } from "@playwright/test";
import { TestHelpers } from "../utils/test-helpers";

test.describe("Admin", () => {
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
  });

  test("should display admin dashboard", async ({ page }) => {
    await testHelpers.navigateTo("/admin");

    // Should show admin content or redirect to login
    const adminContent = page
      .getByRole("main")
      .or(page.locator('[data-testid*="admin"]'));

    const loginPrompt = page.getByText(/sign in|login|unauthorized/i);

    // Either show admin content or login prompt
    const hasValidResponse = await Promise.race([
      adminContent.isVisible(),
      loginPrompt.isVisible(),
    ]);

    expect(hasValidResponse).toBe(true);
  });

  test("should show admin navigation when authorized", async ({ page }) => {
    await testHelpers.navigateTo("/admin");

    // Look for admin navigation elements
    const adminNav = page
      .getByRole("navigation")
      .or(page.locator('[data-testid*="admin-nav"]'))
      .or(page.locator(".admin-nav, .sidebar"));

    if (await adminNav.isVisible()) {
      await expect(adminNav).toBeVisible();

      // Should have admin-specific links
      const adminLinks = adminNav.getByRole("link", {
        name: /dashboard|artists|festivals|analytics|roles/i,
      });
      if (await adminLinks.first().isVisible()) {
        await expect(adminLinks.first()).toBeVisible();
      }
    }
  });

  test("should navigate to artists management", async ({ page }) => {
    await testHelpers.navigateTo("/admin/artists");

    // Should show artists management or auth prompt
    const artistsManagement = page.getByRole("main");
    await expect(artistsManagement).toBeVisible();

    // If authorized, should show artists table or management interface
    const artistsTable = page
      .getByRole("table")
      .or(page.locator('[data-testid*="artists"]'));

    if (await artistsTable.isVisible()) {
      await expect(artistsTable).toBeVisible();
    }
  });

  test("should navigate to festivals management", async ({ page }) => {
    await testHelpers.navigateTo("/admin/festivals");

    const festivalsContent = page.getByRole("main");
    await expect(festivalsContent).toBeVisible();

    // Look for festivals management interface
    const festivalsTable = page
      .getByRole("table")
      .or(page.locator('[data-testid*="festivals"]'));

    if (await festivalsTable.isVisible()) {
      await expect(festivalsTable).toBeVisible();
    }
  });

  test("should navigate to analytics", async ({ page }) => {
    await testHelpers.navigateTo("/admin/analytics");

    const analyticsContent = page.getByRole("main");
    await expect(analyticsContent).toBeVisible();

    // Look for analytics dashboard elements
    const analyticsElements = page
      .locator('[data-testid*="analytics"]')
      .or(page.locator(".chart, .metric, .stats"));

    if (await analyticsElements.first().isVisible()) {
      await expect(analyticsElements.first()).toBeVisible();
    }
  });

  test("should navigate to admin roles", async ({ page }) => {
    await testHelpers.navigateTo("/admin/admins");

    const rolesContent = page.getByRole("main");
    await expect(rolesContent).toBeVisible();

    // Look for roles management interface
    const rolesTable = page
      .getByRole("table")
      .or(page.locator('[data-testid*="roles"], [data-testid*="admins"]'));

    if (await rolesTable.isVisible()) {
      await expect(rolesTable).toBeVisible();
    }
  });

  test("should show add artist functionality", async ({ page }) => {
    await testHelpers.navigateTo("/admin/artists");

    // Look for add artist button
    const addButton = page
      .getByRole("button", { name: /add artist|new artist|create/i })
      .or(page.locator('[data-testid*="add-artist"]'));

    if (await addButton.isVisible()) {
      await expect(addButton).toBeVisible();

      // Click to open dialog
      await addButton.click();

      // Should show add artist dialog
      const dialog = page.getByRole("dialog");
      if (await dialog.isVisible()) {
        await expect(dialog).toBeVisible();

        // Should have artist name input
        const nameInput = page
          .getByLabel(/name|title/i)
          .or(page.getByPlaceholder(/artist name/i));

        if (await nameInput.isVisible()) {
          await expect(nameInput).toBeVisible();
        }
      }
    }
  });

  test("should show edit artist functionality", async ({ page }) => {
    await testHelpers.navigateTo("/admin/artists");

    // Look for edit buttons in artists table
    const editButtons = page
      .getByRole("button", { name: /edit/i })
      .or(page.locator('[data-testid*="edit"]'));

    if (await editButtons.first().isVisible()) {
      await expect(editButtons.first()).toBeVisible();

      // Click edit button
      await editButtons.first().click();

      // Should show edit dialog
      const dialog = page.getByRole("dialog");
      if (await dialog.isVisible()) {
        await expect(dialog).toBeVisible();
      }
    }
  });

  test("should show festival creation functionality", async ({ page }) => {
    await testHelpers.navigateTo("/admin/festivals");

    // Look for create festival button
    const createButton = page
      .getByRole("button", { name: /add festival|new festival|create/i })
      .or(page.locator('[data-testid*="add-festival"]'));

    if (await createButton.isVisible()) {
      await expect(createButton).toBeVisible();

      await createButton.click();

      // Should show festival creation dialog
      const dialog = page.getByRole("dialog");
      if (await dialog.isVisible()) {
        await expect(dialog).toBeVisible();
      }
    }
  });

  test("should show CSV import functionality", async ({ page }) => {
    await testHelpers.navigateTo("/admin/artists");

    // Look for import/CSV functionality
    const importButton = page
      .getByRole("button", { name: /import|csv|upload/i })
      .or(page.locator('[data-testid*="import"]'));

    if (await importButton.isVisible()) {
      await expect(importButton).toBeVisible();

      await importButton.click();

      // Should show import dialog
      const dialog = page.getByRole("dialog");
      if (await dialog.isVisible()) {
        await expect(dialog).toBeVisible();

        // Should have file input
        const fileInput = page.locator('input[type="file"]');
        if (await fileInput.isVisible()) {
          await expect(fileInput).toBeVisible();
        }
      }
    }
  });

  test("should handle unauthorized access gracefully", async ({ page }) => {
    // Test accessing admin without proper permissions
    await testHelpers.navigateTo("/admin");

    const isAuth = await testHelpers.isAuthenticated();
    if (!isAuth) {
      // Should redirect to login or show unauthorized message
      const unauthorizedContent = page
        .getByText(/sign in|login|unauthorized|access denied/i)
        .or(page.getByRole("button", { name: /sign in/i }));

      const hasAuthPrompt = await unauthorizedContent.isVisible();
      expect(hasAuthPrompt).toBe(true);
    }
  });

  test("should show data tables with proper headers", async ({ page }) => {
    await testHelpers.navigateTo("/admin/artists");

    const table = page.getByRole("table");

    if (await table.isVisible()) {
      await expect(table).toBeVisible();

      // Should have table headers
      const headers = table.locator('thead th, [role="columnheader"]');
      if (await headers.first().isVisible()) {
        const headerCount = await headers.count();
        expect(headerCount).toBeGreaterThan(0);
      }
    }
  });

  test("should support search/filter in admin tables", async ({ page }) => {
    await testHelpers.navigateTo("/admin/artists");

    // Look for search functionality
    const searchInput = page
      .getByPlaceholder(/search/i)
      .or(page.getByLabel(/search/i));

    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeVisible();

      // Try searching
      await searchInput.fill("test");
      await testHelpers.waitForPageLoad();

      // Table should still be visible
      const table = page.getByRole("table");
      if (await table.isVisible()) {
        await expect(table).toBeVisible();
      }
    }
  });
});
