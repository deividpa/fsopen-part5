import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const mockBlog = {
  title: 'Testing Blog Component',
  author: 'Test Author',
  url: 'https://testurl.com',
  likes: 5,
  user: {
    name: 'David Pérez Test'
  }
};

const mockOnLikeBlog = vi.fn()
const mockOnDeleteBlog = vi.fn()

test('5.13: renders blog title and author but not URL or likes by default', () => {
  render(<Blog blog={mockBlog} onLikeBlog={mockOnLikeBlog} onDeleteBlog={mockOnDeleteBlog} />);

  // Check if the title and author are rendered
  const titleElement = screen.getByText('Testing Blog Component');
  const authorElement = screen.getByText('Test Author');
  expect(titleElement).toBeInTheDocument();
  expect(authorElement).toBeInTheDocument();

  // Check if the URL and likes are not rendered due to the 'visible' button was not clicked
  const urlElement = screen.queryByText('https://testurl.com');
  const likesElement = screen.queryByText('likes: 5');
  expect(urlElement).toBeNull();
  expect(likesElement).toBeNull();
});

test('5.14: shows blog URL and number of likes when the details button is clicked', async () => {

   render(<Blog blog={mockBlog} onLikeBlog={mockOnLikeBlog} onDeleteBlog={mockOnDeleteBlog} />)

   // Ensure the details are hidden initially
   expect(screen.queryByText('https://testurl.com')).toBeNull()
   expect(screen.queryByText('likes: 5')).toBeNull()
 

   const user = userEvent.setup()
   const toggleButton = screen.getByText('view')
   await user.click(toggleButton)

   const urlElement = screen.queryByText('https://testurl.com')
   const likesElement = screen.getByText('likes: 5')
   expect(urlElement).toBeInTheDocument()
   expect(likesElement).toBeInTheDocument()
})

test('5.15: calls the like event handler twice if the like button is clicked twice', async () => {
  render(<Blog blog={mockBlog} onLikeBlog={mockOnLikeBlog} onDeleteBlog={mockOnDeleteBlog} />)

  const user = userEvent.setup()

  // Simulate clicking the "view" button to show the "like" button
  const toggleButton = screen.getByText('view')
  await user.click(toggleButton)

  // Simulate clicking the "like" button twice
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  // Check that the event handler is called twice
  // expect(mockOnLikeBlog).toHaveBeenCalledTimes(2)
  expect(mockOnLikeBlog.mock.calls).toHaveLength(2)
})