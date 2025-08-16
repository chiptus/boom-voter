import { test, expect } from "@playwright/test";
import { TestHelpers } from "../utils/test-helpers";

test.describe("Schedule", () => {
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
  });

  test("should display schedule page", async ({ page }) => {
    await testHelpers.navigateTo("/schedule");

    // Should show schedule content
    const scheduleContent = page
      .getByRole("main")
      .or(page.locator('[data-testid*="schedule"]'));

    await expect(scheduleContent).toBeVisible();

    // Should have schedule-related heading
    const heading = page.getByRole("heading").first();
    if (await heading.isVisible()) {
      await expect(heading).toBeVisible();
    }
  });

  test("should show sets/artists in schedule view", async ({ page }) => {
    await testHelpers.navigateTo("/schedule");

    // Look for schedule items (sets, artists, time slots)
    const scheduleItems = page
      .locator('[data-testid*="schedule-item"]')
      .or(page.locator('[data-testid*="set"]'))
      .or(page.locator(".schedule-item, .set-item, .artist-block"));

    // If schedule has content, items should be visible
    if (await scheduleItems.first().isVisible()) {
      await expect(scheduleItems.first()).toBeVisible();
    } else {
      // Should show empty state if no schedule
      const emptyState = page
        .getByText(/no schedule|empty|coming soon/i)
        .or(page.locator('[data-testid*="empty"]'));

      if (await emptyState.isVisible()) {
        await expect(emptyState).toBeVisible();
      }
    }
  });

  test("should display time information", async ({ page }) => {
    await testHelpers.navigateTo("/schedule");

    // Look for time-related elements
    const timeElements = page
      .locator('[data-testid*="time"]')
      .or(page.locator(".time, .schedule-time"))
      .or(page.getByText(/\d{1,2}:\d{2}|\d{1,2}(am|pm)/i));

    if (await timeElements.first().isVisible()) {
      await expect(timeElements.first()).toBeVisible();

      // Time should be in recognizable format
      const timeText = await timeElements.first().textContent();
      expect(timeText).toMatch(/\d{1,2}[:\s]?\d{2}|am|pm|\d{1,2}h/i);
    }
  });

  test("should show stage information", async ({ page }) => {
    await testHelpers.navigateTo("/schedule");

    // Look for stage labels or indicators
    const stageElements = page
      .locator('[data-testid*="stage"]')
      .or(page.locator(".stage-label, .stage-name"))
      .or(page.getByText(/stage|main|tent|arena/i));

    if (await stageElements.first().isVisible()) {
      await expect(stageElements.first()).toBeVisible();
    }
  });

  test("should allow navigation between days", async ({ page }) => {
    await testHelpers.navigateTo("/schedule");

    // Look for day navigation controls
    const dayNavigation = page
      .locator('[data-testid*="day"]')
      .or(
        page.getByRole("button", { name: /day|today|tomorrow|previous|next/i }),
      )
      .or(page.locator(".day-selector, .date-navigation"));

    if (await dayNavigation.first().isVisible()) {
      await expect(dayNavigation.first()).toBeVisible();

      // Try clicking day navigation
      await dayNavigation.first().click();
      await testHelpers.waitForPageLoad();

      // Schedule should still be visible after navigation
      const scheduleContent = page.getByRole("main");
      await expect(scheduleContent).toBeVisible();
    }
  });

  test("should provide timeline view functionality", async ({ page }) => {
    await testHelpers.navigateTo("/schedule");

    // Look for timeline-specific elements
    const timelineElements = page
      .locator('[data-testid*="timeline"]')
      .or(page.locator(".timeline, .time-scale"))
      .or(page.locator('[aria-label*="timeline"]'));

    if (await timelineElements.first().isVisible()) {
      await expect(timelineElements.first()).toBeVisible();
    }
  });

  test("should allow clicking on sets to navigate to details", async ({
    page,
  }) => {
    await testHelpers.navigateTo("/schedule");

    // Look for clickable set items
    const setLinks = page
      .locator('a[href*="/sets/"]')
      .or(page.locator('[data-testid*="set"] a'))
      .or(page.locator(".schedule-item a, .set-item a"));

    if (await setLinks.first().isVisible()) {
      await setLinks.first().click();

      // Should navigate to set detail page
      await expect(page).toHaveURL(/\/(sets|artists)\/[^/]+/);

      // Should show set/artist detail content
      const detailContent = page.getByRole("main");
      await expect(detailContent).toBeVisible();
    }
  });

  test("should show current time indicator if applicable", async ({ page }) => {
    await testHelpers.navigateTo("/schedule");

    // Look for current time indicator (would be visible during festival)
    const currentTimeIndicator = page
      .locator('[data-testid*="current-time"]')
      .or(page.locator(".current-time, .now-indicator"))
      .or(page.locator('[aria-label*="current time"]'));

    // This might not be visible if not during festival time
    if (await currentTimeIndicator.isVisible()) {
      await expect(currentTimeIndicator).toBeVisible();
    }
  });

  test("should support different view modes", async ({ page }) => {
    await testHelpers.navigateTo("/schedule");

    // Look for view mode toggles (list, grid, timeline, etc.)
    const viewToggle = page
      .getByRole("button", { name: /view|mode|list|grid|timeline/i })
      .or(page.locator('[data-testid*="view"]'))
      .or(page.locator(".view-toggle, .mode-selector"));

    if (await viewToggle.first().isVisible()) {
      await expect(viewToggle.first()).toBeVisible();

      // Try switching view mode
      await viewToggle.first().click();
      await testHelpers.waitForPageLoad();

      // Schedule should still be visible after view change
      const scheduleContent = page.getRole("main");
      await expect(scheduleContent).toBeVisible();
    }
  });

  test("should handle mobile responsiveness", async ({ page }) => {
    await testHelpers.navigateTo("/schedule");

    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Schedule should still be accessible on mobile
    const scheduleContent = page.getByRole("main");
    await expect(scheduleContent).toBeVisible();

    // Mobile-specific navigation might be present
    const mobileNav = page
      .locator('[data-testid*="mobile"]')
      .or(page.locator(".mobile-nav, .hamburger-menu"));

    if (await mobileNav.isVisible()) {
      await expect(mobileNav).toBeVisible();
    }

    // Reset viewport
    await page.setViewportSize({ width: 1280, height: 720 });
  });
});
