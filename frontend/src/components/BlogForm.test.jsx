import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'


test('5.16: calls the event handler with the right details when a new blog is created', async () => {
    const mockCreateBlog = vi.fn()
  
    // Render the BlogForm component
    render(<BlogForm createBlog={mockCreateBlog} />)
  
    // Simulate user input in the form fields
    const user = userEvent.setup()
    
    const inputTitle = screen.getByPlaceholderText('Enter blog title')
    const inputAuthor = screen.getByPlaceholderText('Enter blog author')
    const inputUrl = screen.getByPlaceholderText('Enter blog URL')
  
    await user.type(inputTitle, 'New Blog Title')
    await user.type(inputAuthor, 'New Blog Author')
    await user.type(inputUrl, 'https://newblogurl.com')
  
    // Simulate form submission
    const submitButton = screen.getByText('Create')
    await user.click(submitButton)
  
    // Check that the event handler was called with the correct details
    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'New Blog Title',
      author: 'New Blog Author',
      url: 'https://newblogurl.com'
    })
})