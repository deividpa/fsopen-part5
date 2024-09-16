import { useEffect, useState, useRef } from 'react'
import blogService from './services/blogService'
import loginService from './services/loginService'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import Blog from './components/Blog'

const App = () => {
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ content: '', type: '' }) // type: info, success, error
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    if (user) {
      blogService.getAllSortedByLikes().then((initialBlogs) => {
        setBlogs(initialBlogs)
      })
    }
  }, [user])

  const handleNotification = (content, type = 'info') => {
    setNotification({ content, type })
    setTimeout(() => {
      setNotification({ content: '', type: '' })
    }, 5000)
  }

  const handleLogin = async ({ username, password }) => {
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      handleNotification('Login successful', 'success')
    } catch (error) {
      handleNotification('Wrong credentials', 'error')
    }
  }

  const handleLogout = () => {
    setUser(null)
    setBlogs([])
    window.localStorage.removeItem('loggedBlogAppUser')
    handleNotification('Logged out', 'info')
  }

  const handleCreateBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog, user.token)
      setBlogs(blogs.concat(createdBlog))
      blogFormRef.current.toggleVisibility()
      handleNotification(`Blog "${createdBlog.title}" by ${createdBlog.author} added successfully`, 'success')
    } catch (error) {
      handleNotification('Error creating blog', 'error')
    }
  }

  const handleLikeBlog = async (id) => {
    const blogToLike = blogs.find((blog) => blog.id === id)

    try {
      const updatedBlog = {
        ...blogToLike,
        likes: blogToLike.likes + 1,
        user: blogToLike.user
      }
      const returnedBlog = await blogService.update(id, updatedBlog)

      setBlogs((prevBlogs) =>
        prevBlogs
          .map(blog => blog.id !== id ? blog : returnedBlog)
          .sort((a, b) => b.likes - a.likes) // sort by likes in descending order
      )

      handleNotification(`Blog "${returnedBlog.title}" liked successfully`, 'success')
    } catch (error) {
      handleNotification('Error liking blog', 'error')
    }
  }

  const handleDeleteBlog = async (id) => {
    const blogToDelete = blogs.find((blog) => blog.id === id)
    if (window.confirm(`Are you sure you want to delete "${blogToDelete.title}"?`)) {
      try {
        await blogService.deleteBlog(id, user.token)

        setBlogs((prevBlogs) =>
          prevBlogs
            .filter(blog => blog.id !== id)
            .sort((a, b) => b.likes - a.likes)
        )

        handleNotification(`Blog "${blogToDelete.title}" deleted successfully`, 'success')
      } catch (error) {
        handleNotification('Error deleting blog', 'error')
      }
    }
  }

  if (!user) {
    return (
      <div>
        <Notification type={notification.type} content={notification.content} />
        <Togglable buttonLabel='show login'>
          <LoginForm onLogin={handleLogin} />
        </Togglable>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
      <Notification type={notification.type} content={notification.content} />

      <Togglable buttonLabel='Create new blog' ref={blogFormRef}>
        <BlogForm createBlog={handleCreateBlog} />
      </Togglable>

      <h3>Blog List</h3>
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          onLikeBlog={handleLikeBlog}
          onDeleteBlog={handleDeleteBlog}
          currentUsername={user.username}
        />
      ))}
    </div>
  )
}

export default App