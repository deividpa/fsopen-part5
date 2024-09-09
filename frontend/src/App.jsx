import { useEffect, useState } from 'react';
import blogService from './services/blogService';
import loginService from './services/loginService';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      blogService.getAll().then((initialBlogs) => {
        setBlogs(initialBlogs);
      });
    }
  }, [user]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loggedUser = await loginService.login({ username, password });

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(loggedUser));
      setUser(loggedUser);
      setUsername('');
      setPassword('');
      setMessage('Login successful');
    } catch (error) {
      setMessage('Wrong credentials');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setBlogs([]);
    window.localStorage.removeItem('loggedBlogAppUser');
    setMessage('Logged out');
  };

  const handleCreateBlog = async (event) => {
    event.preventDefault();
    try {
      const createdBlog = await blogService.create(newBlog, user.token);
      setBlogs(blogs.concat(createdBlog));
      setNewBlog({ title: '', author: '', url: '' });
      setMessage(`Blog "${createdBlog.title}" by ${createdBlog.author} added successfully`);
    } catch (error) {
      setMessage('Error creating blog');
    }
  };

  const handleDeleteBlog = async (id) => {
    const blogToDelete = blogs.find((blog) => blog.id === id);
    if (window.confirm(`Are you sure you want to delete "${blogToDelete.title}"?`)) {
      try {
        await blogService.deleteBlog(id, user.token);
        setBlogs(blogs.filter((blog) => blog.id !== id));
        setMessage(`Blog "${blogToDelete.title}" deleted successfully`);
      } catch (error) {
        setMessage('Error deleting blog');
      }
    }
  };

  const handleInputChange = ({ target }) => {
    setNewBlog({ ...newBlog, [target.name]: target.value });
  };

  if (!user) {
    return (
      <div>
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            Username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">Login</button>
        </form>
        {message && <div>{message}</div>}
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
      {message && <div>{message}</div>}
      
      <h3>Create new</h3>
      <form onSubmit={handleCreateBlog}>
        <div>
          Title:
          <input
            type="text"
            name="title"
            value={newBlog.title}
            onChange={handleInputChange}
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            name="author"
            value={newBlog.author}
            onChange={handleInputChange}
          />
        </div>
        <div>
          URL:
          <input
            type="text"
            name="url"
            value={newBlog.url}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Create</button>
      </form>

      <h3>Blog List</h3>
      {blogs.map(blog => (
        <div key={blog.id}>
          {blog.title} by {blog.author}
          <button onClick={() => handleDeleteBlog(blog.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default App;