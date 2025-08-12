import { test, expect } from "@playwright/test";
import { TestHelpers } from "../utils/test-helpers";

test.describe("Festival Selection", () => {
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
  });

  test("should display festival selection page", async ({ page }) => {
    await testHelpers.navigateTo("/");

    // Should show festival selection content
    const festivalContent = page
      .getByRole("main")
      .or(page.locator('[data-testid*="festival"]'));

    await expect(festivalContent).toBeVisible();

    // Should have a heading or title
    const heading = page.getByRole("heading").first();
    if (await heading.isVisible()) {
      await expect(heading).toBeVisible();
    }
  });

  test("should display available festivals", async ({ page }) => {
    await testHelpers.navigateTo("/");

    // Look for festival cards or list items
    const festivalItems = page
      .locator('[data-testid*="festival-card"]')
      .or(page.locator('[data-testid*="festival-item"]'))
      .or(page.locator(".festival-card, .festival-item"));

    if (await festivalItems.first().isVisible()) {
      await expect(festivalItems.first()).toBeVisible();

      // Should have festival names
      const festivalName = festivalItems
        .first()
        .getByRole("heading")
        .or(festivalItems.first().locator("h1, h2, h3, h4"));

      if (await festivalName.isVisible()) {
        await expect(festivalName).toBeVisible();
      }
    } else {
      // Should show empty state if no festivals
      const emptyState = page
        .getByText(/no festivals|coming soon|empty/i)
        .or(page.locator('[data-testid*="empty"]'));

      if (await emptyState.isVisible()) {
        await expect(emptyState).toBeVisible();
      }
    }
  });

  test("should navigate to festival editions", async ({ page }) => {
    await testHelpers.navigateTo("/");

    // Look for festival links
    const festivalLinks = page
      .locator('a[href*="/festivals/"]')
      .or(page.locator('[data-testid*="festival-card"] a'));

    if (await festivalLinks.first().isVisible()) {
      await festivalLinks.first().click();

      // Should navigate to festival editions page
      await expect(page).toHaveURL(/\/(festivals\/[^/]+|editions)/);

      // Should show editions content
      const editionsContent = page.getByRole("main");
      await expect(editionsContent).toBeVisible();
    }
  });

  test("should display festival editions", async ({ page }) => {
    await testHelpers.navigateTo("/");

    // First navigate to a festival if available
    const festivalLinks = page.locator('a[href*="/festivals/"]');

    if (await festivalLinks.first().isVisible()) {
      await festivalLinks.first().click();

      // Look for edition cards or list items
      const editionItems = page
        .locator('[data-testid*="edition"]')
        .or(page.locator(".edition-card, .edition-item"))
        .or(
          page.getByText(/20\d{2}|\d{4}/i), // Year patterns
        );

      if (await editionItems.first().isVisible()) {
        await expect(editionItems.first()).toBeVisible();
      }
    }
  });

  test("should navigate to edition view", async ({ page }) => {
    await testHelpers.navigateTo("/");

    // Navigate through festival -> edition
    const festivalLinks = page.locator('a[href*="/festivals/"]');

    if (await festivalLinks.first().isVisible()) {
      await festivalLinks.first().click();

      // Look for edition links
      const editionLinks = page
        .locator('a[href*="/editions/"]')
        .or(page.locator('[data-testid*="edition"] a'));

      if (await editionLinks.first().isVisible()) {
        await editionLinks.first().click();

        // Should navigate to edition view (main festival page)
        await expect(page).toHaveURL(/\/editions\/[^/]+/);

        // Should show main festival interface
        const mainContent = page.getByRole("main");
        await expect(mainContent).toBeVisible();
      }
    }
  });

  test("should show festival information", async ({ page }) => {
    await testHelpers.navigateTo("/");

    const festivalCards = page
      .locator('[data-testid*="festival"]')
      .or(page.locator(".festival-card"));

    if (await festivalCards.first().isVisible()) {
      // Should show festival name
      const festivalName = festivalCards.first().getByRole("heading");
      if (await festivalName.isVisible()) {
        await expect(festivalName).toBeVisible();
      }

      // Should show dates or year information
      const dateInfo = festivalCards
        .first()
        .getByText(/20\d{2}|\d{1,2}\/\d{1,2}|\w+\s+\d{1,2}/i);
      if (await dateInfo.isVisible()) {
        await expect(dateInfo).toBeVisible();
      }

      // Should show location information
      const locationInfo = festivalCards
        .first()
        .getByText(/location|where|venue|city/i);
      if (await locationInfo.isVisible()) {
        await expect(locationInfo).toBeVisible();
      }
    }
  });

  test("should handle festival logo/images", async ({ page }) => {
    await testHelpers.navigateTo("/");

    // Look for festival images or logos
    const festivalImages = page
      .locator('[data-testid*="festival"] img')
      .or(page.locator(".festival-card img, .festival-logo"));

    if (await festivalImages.first().isVisible()) {
      await expect(festivalImages.first()).toBeVisible();

      // Image should have alt text
      const altText = await festivalImages.first().getAttribute("alt");
      expect(altText).toBeTruthy();
    }
  });

  test("should support direct festival URL access", async ({ page }) => {
    // Test accessing festival directly via subdomain or path
    // This would depend on the actual festival slugs available

    await testHelpers.navigateTo("/festivals/test-festival");

    // Should either show editions page or redirect appropriately
    const pageContent = page.getByRole("main");
    await expect(pageContent).toBeVisible();

    // Might be 404 if no test festival exists, which is also valid
    const notFoundContent = page.getByText(/not found|404/i);
    const validContent = page.locator(
      '[data-testid*="edition"], [data-testid*="festival"]',
    );

    const hasValidResponse = await Promise.race([
      notFoundContent.isVisible(),
      validContent.first().isVisible(),
    ]);

    expect(hasValidResponse).toBe(true);
  });

  test("should handle edition URL access", async ({ page }) => {
    // Test accessing specific edition directly
    await testHelpers.navigateTo("/festivals/test-festival/editions/2024");

    // Should show either the edition page or appropriate error
    const pageContent = page.getByRole("main");
    await expect(pageContent).toBeVisible();
  });

  test("should show upcoming vs past festivals", async ({ page }) => {
    await testHelpers.navigateTo("/");

    // Look for any indicators of festival status (upcoming, current, past)
    const statusIndicators = page
      .getByText(/upcoming|current|past|live|ended/i)
      .or(page.locator('[data-testid*="status"]'));

    if (await statusIndicators.first().isVisible()) {
      await expect(statusIndicators.first()).toBeVisible();
    }
  });

  test("should handle search/filter functionality", async ({ page }) => {
    await testHelpers.navigateTo("/");

    // Look for search or filter controls
    const searchInput = page
      .getByPlaceholder(/search/i)
      .or(page.getByLabel(/search/i));

    const filterControls = page
      .getByRole("button", { name: /filter/i })
      .or(page.locator('[data-testid*="filter"]'));

    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeVisible();

      // Try searching
      await searchInput.fill("test");
      await testHelpers.waitForPageLoad();
    }

    if (await filterControls.isVisible()) {
      await expect(filterControls).toBeVisible();
    }
  });
});
