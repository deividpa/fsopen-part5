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

        const anotherUser = {
            username: 'anotherUser',
            password: 'anotherPassword',
            name: 'Another User'
        };

        await request.post('http://localhost:3003/api/users', { data: anotherUser });
    
        await page.goto('http://localhost:5173');
    })
  
    test('Login form is shown', async ({ page }) => {
        const togglableLoginButton = await page.locator('button', { hasText: 'show login' })
        await expect(togglableLoginButton).toBeVisible()
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
            const successMessage = await page.locator('.success')
            await expect(successMessage)
                .toHaveText(/Blog "Test Blog Title with Playwright" by Test Author added successfully/)
        })

        test('a blog can be liked', async ({ page }) => {
            await page.locator('button', { hasText: 'Create new blog' }).click()
  
            await page.fill('input[placeholder="Enter blog title"]', 'Test Blog Title with Playwright')
            await page.fill('input[placeholder="Enter blog author"]', 'Test Author')
            await page.fill('input[placeholder="Enter blog URL"]', 'http://testurlplaywright.com')
  
            await page.locator('#createBlog').click()
  
            // Like the blog
            await page.locator('button', { hasText: 'View' }).click() // Open blog details
            const likeButton = await page.locator('button', { hasText: 'like' })
            await likeButton.click()
  
            // Check that the likes count increased
            const likeCount = await page.locator('.likes-count')
            await expect(likeCount).toHaveText('1')
        })

        test('the user who added the blog can delete it', async ({ page }) => {
            await page.locator('button', { hasText: 'Create new blog' }).click()
        
            await page.fill('input[placeholder="Enter blog title"]', 'Blog to be deleted')
            await page.fill('input[placeholder="Enter blog author"]', 'Author to delete')
            await page.fill('input[placeholder="Enter blog URL"]', 'http://deletetesturl.com')
        
            await page.locator('#createBlog').click()
        
            const successMessage = await page.locator('.success')
            await expect(successMessage)
              .toHaveText(/Blog "Blog to be deleted" by Author to delete added successfully/)
        
            // Show blog details to access the delete button
            await page.locator('button', { hasText: 'View' }).click()
        
            // Open the dialog to accept the deletion
            page.on('dialog', async dialog => {
              expect(dialog.type()).toBe('confirm')  // Ensure it's a confirm dialog
              await dialog.accept()
            })

            // Click the delete button and accept the dialog with the confirmation
            await page.locator('button', { hasText: 'Delete' }).click()
        
            // Ensure the blog has been removed from the list
            const blog = await page.locator('span', { hasText: 'Blog to be deleted' })
            await expect(blog).not.toBeVisible()
        })

        test('only the user who added the blog can see the delete button', async ({ page }) => {
            // Create a new blog with the first user
            await page.locator('button', { hasText: 'Create new blog' }).click();
            await page.fill('input[placeholder="Enter blog title"]', 'Test Blog for Delete Button Visibility');
            await page.fill('input[placeholder="Enter blog author"]', 'Test Author');
            await page.fill('input[placeholder="Enter blog URL"]', 'http://testvisibilityurl.com');
            await page.locator('#createBlog').click();
      
            // Show blog details to access the delete button
            await page.locator('button', { hasText: 'View' }).click();
      
            // Ensure the delete button is visible for the creator
            const deleteButton = await page.locator('button', { hasText: 'Delete' });
            await expect(deleteButton).toBeVisible();
      
            // Log out
            await page.getByText('Logout').click();
      
            // Log in as another user
            await page.locator('button', { hasText: 'show login' }).click();
            await page.fill('input[name="Username"]', 'anotherUser');
            await page.fill('input[name="Password"]', 'anotherPassword');
            await page.getByText('Login', { exact: true }).click();
      
            // Ensure the delete button is not visible for the non-creator
            await page.locator('button', { hasText: 'View' }).click();
            await expect(deleteButton).not.toBeVisible();
        });

        // test('blogs are ordered by likes', async ({ page }) => {
        //     // Create three blogs with different amounts of likes
        //     await page.locator('button', { hasText: 'Create new blog' }).click();
        //     await page.fill('input[placeholder="Enter blog title"]', 'First Blog');
        //     await page.fill('input[placeholder="Enter blog author"]', 'First Author');
        //     await page.fill('input[placeholder="Enter blog URL"]', 'http://firstblog.com');
        //     await page.locator('#createBlog').click();

        
        //     await page.locator('button', { hasText: 'Create new blog' }).click();
        //     await page.fill('input[placeholder="Enter blog title"]', 'Second Blog');
        //     await page.fill('input[placeholder="Enter blog author"]', 'Second Author');
        //     await page.fill('input[placeholder="Enter blog URL"]', 'http://secondblog.com');
        //     await page.locator('#createBlog').click();


        //     // Give likes to the blogs
        //     // First blog with 1 like
        //     const firstBlog = await page.locator('.blog', { hasText: 'First Blog' }).first();
        //     await firstBlog.locator('button', { hasText: 'View' }).click();
        //     await page.waitForSelector('.blog .likes-count');
        //     await firstBlog.locator('button', { hasText: 'like' }).click();
        //     await page.waitForTimeout(2000);
        
        //     // Second blog with 3 likes
        //     const secondBlog = await page.locator('.blog', { hasText: 'Second Blog' }).first();
        //     await secondBlog.locator('button', { hasText: 'View' }).click();
        //     await page.waitForSelector('.blog .likes-count');
        //     await secondBlog.locator('button', { hasText: 'like' }).click();
        //     await page.waitForTimeout(2000);
        //     await secondBlog.locator('button', { hasText: 'like' }).click();
        //     await page.waitForTimeout(2000);
        //     await secondBlog.locator('button', { hasText: 'like' }).click();
        //     await page.waitForTimeout(2000);
        
        //     // Get the likes count for each blog
        //     const blogLikes = await page.$$eval('.likes-count', likes => 
        //         likes.map(likeElement => Number(likeElement.textContent))
        //     );

        //     // Ensure the blogs are ordered by likes
        //     expect(blogLikes).toEqual([...blogLikes].sort((a, b) => b - a));
        // });

        test('blogs are ordered by likes', async ({ page }) => {
            // Create three blogs with different amounts of likes
            await page.locator('button', { hasText: 'Create new blog' }).click();
            await page.fill('input[placeholder="Enter blog title"]', 'First Blog');
            await page.fill('input[placeholder="Enter blog author"]', 'First Author');
            await page.fill('input[placeholder="Enter blog URL"]', 'http://firstblog.com');
            await page.locator('#createBlog').click();
            
            await page.waitForTimeout(2000); // Wait for the blog to appear
        
            await page.locator('button', { hasText: 'Create new blog' }).click();
            await page.fill('input[placeholder="Enter blog title"]', 'Second Blog');
            await page.fill('input[placeholder="Enter blog author"]', 'Second Author');
            await page.fill('input[placeholder="Enter blog URL"]', 'http://secondblog.com');
            await page.locator('#createBlog').click();
            
            await page.waitForTimeout(2000); // Wait for the blog to appear
        
            await page.locator('button', { hasText: 'Create new blog' }).click();
            await page.fill('input[placeholder="Enter blog title"]', 'Third Blog');
            await page.fill('input[placeholder="Enter blog author"]', 'Third Author');
            await page.fill('input[placeholder="Enter blog URL"]', 'http://thirdblog.com');
            await page.locator('#createBlog').click();
            
            await page.waitForTimeout(2000); // Wait for the blog to appear
        
            // Give likes to the blogs
            // First blog with 1 like
            const firstBlog = await page.locator('.blog', { hasText: 'First Blog' }).first();
            await firstBlog.locator('button', { hasText: 'View' }).click();
            await page.waitForSelector('.blog .likes-count');
            await firstBlog.locator('button', { hasText: 'like' }).click();
            await page.waitForTimeout(2000); // Wait for like to be processed
        
            // Second blog with 3 likes
            const secondBlog = await page.locator('.blog', { hasText: 'Second Blog' }).first();
            await secondBlog.locator('button', { hasText: 'View' }).click();
            await page.waitForSelector('.blog .likes-count');
            await secondBlog.locator('button', { hasText: 'like' }).click();
            await page.waitForTimeout(2000); // Wait for like to be processed
            await secondBlog.locator('button', { hasText: 'like' }).click();
            await page.waitForTimeout(2000); // Wait for like to be processed
            await secondBlog.locator('button', { hasText: 'like' }).click();
            await page.waitForTimeout(2000); // Wait for like to be processed
        
            // Third blog with 2 likes
            const thirdBlog = await page.locator('.blog', { hasText: 'Third Blog' }).first();
            await thirdBlog.locator('button', { hasText: 'View' }).click();
            await page.waitForSelector('.blog .likes-count');
            await thirdBlog.locator('button', { hasText: 'like' }).click();
            await page.waitForTimeout(2000); // Wait for like to be processed
            await thirdBlog.locator('button', { hasText: 'like' }).click();
            await page.waitForTimeout(2000); // Wait for like to be processed
        
            // Get the likes count for each blog
            const blogLikes = await page.$$eval('.likes-count', likes => 
                likes.map(likeElement => Number(likeElement.textContent))
            );
        
            // Ensure the blogs are ordered by likes
            expect(blogLikes).toEqual([...blogLikes].sort((a, b) => b - a));
        });
        
    })
})
