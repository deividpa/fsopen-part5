const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
    
        const newUser = {
            username: 'davidTest',
            password: '123456',
            name: 'David Test'
        }
    
        await request.post('http://localhost:3003/api/users', { data: newUser })

        await page.goto('http://localhost:5173')

        await page.evaluate(() => {
            window.localStorage.clear()
        });
    })
  
    test('Login form is shown', async ({ page }) => {
        const togglableLoginButton = await page.locator('button', { hasText: 'show login' });
        await expect(togglableLoginButton).toBeVisible();
    })
  
    describe('Login', () => {
        // Successfull login test
        test('succeeds with correct credentials', async ({ page }) => {
            await page.locator('button', { hasText: 'show login' }).click()
    
            // Fill the login form with correct credentials
            await page.fill('input[name="Username"]', 'davidTest')
            await page.fill('input[name="Password"]', '123456')
    
            await page.getByText("Login", { exact: true }).click()
            
            // Check that the user is logged in
            const userWelcome = await page.getByText("David Test logged in")
            await expect(userWelcome).toBeVisible()
        })
  
        // Wrong credentials test
        test('fails with wrong credentials', async ({ page }) => {
            await page.locator('button', { hasText: 'show login' }).click()

            // Fill the login form with wrong credentials
            await page.getByTestId('username').fill('wrongusername')
            await page.getByTestId('password').fill('wrongpassword')

            await page.getByText("Login", { exact: true }).click()

            // Check that the error message is shown
            const errorMessage = await page.getByText("Wrong credentials")
            await expect(errorMessage).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
          await page.locator('button', { hasText: 'show login' }).click()
          await page.fill('input[name="Username"]', 'davidTest')
          await page.fill('input[name="Password"]', '123456')
          await page.getByText('Login', { exact: true }).click()
        })
  
        test('a new blog can be created', async ({ page }) => {
          await page.locator('button', { hasText: 'Create new blog' }).click()
  
          await page.fill('input[placeholder="Enter blog title"]', 'Test Blog Title with Playwright')
          await page.fill('input[placeholder="Enter blog author"]', 'Test Author')
          await page.fill('input[placeholder="Enter blog URL"]', 'http://testurlplaywright.com')
  
          await page.locator('#createBlog').click()
  
          // Check that the blog appears in the list
          const successMessage = await page.locator('.success');
          await expect(successMessage)
            .toHaveText(/Blog "Test Blog Title with Playwright" by Test Author added successfully/);
        })
    })
})
