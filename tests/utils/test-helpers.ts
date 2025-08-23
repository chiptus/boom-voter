import { Page, expect } from "@playwright/test";
import { TEST_CONFIG } from "../config/test-env";

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Sign in with test credentials
   */
  async signIn(
    email = TEST_CONFIG.TEST_USER_EMAIL,
    password = TEST_CONFIG.TEST_USER_PASSWORD,
  ) {
    await this.page.goto("/");

    // Click sign in button
    const signInButton = this.page.getByRole("button", { name: /sign in/i });

    await signInButton.click();

    // Wait for auth dialog
    const authDialog = this.page.getByRole("dialog");
    await expect(authDialog).toBeVisible();

    // Fill in credentials
    const emailInput = this.page
      .getByLabel(/email/i)
      .or(this.page.getByPlaceholder(/email/i));

    await emailInput.fill(email);

    // Submit form
    const submitButton = this.page
      .getByRole("button", { name: /sign in/i })
      .or(this.page.getByRole("button", { name: /login/i }));

    await submitButton.click();

    // Wait for successful sign in (user menu or avatar should appear)
    await expect(
      this.page
        .getByRole("button", { name: /user/i })
        .or(this.page.locator('[data-testid="user-avatar"]')),
    ).toBeVisible({ timeout: 10000 });
  }

  /**
   * Sign out
   */
  async signOut() {
    const userMenu = this.page
      .getByRole("button", { name: /user/i })
      .or(this.page.locator('[data-testid="user-avatar"]'));

    if (await userMenu.isVisible()) {
      await userMenu.click();

      const signOutButton = this.page
        .getByRole("button", { name: /sign out/i })
        .or(this.page.getByText(/sign out/i));

      await signOutButton.click();

      // Wait for sign out to complete
      await expect(
        this.page.getByRole("button", { name: /sign in/i }),
      ).toBeVisible();
    }
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const userMenu = this.page
      .getByRole("button", { name: /user/i })
      .or(this.page.locator('[data-testid="user-avatar"]'));

    return await userMenu.isVisible();
  }

  /**
   * Navigate to a specific page
   */
  async navigateTo(path: string) {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  /**
   * Wait for a specific element to be visible
   */
  async waitForElement(selector: string, timeout = 5000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Take a screenshot for debugging
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `tests/screenshots/${name}.png` });
  }
}
