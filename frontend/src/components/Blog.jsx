import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, onLikeBlog, onDeleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    padding: 15,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle} className="blog">
      <div>
        <span style={{marginRight: 3}}>{blog.title}</span>
        <span style={{marginRight: 3}}>{blog.author}</span>
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            <span>likes: {blog.likes}</span>
            <button onClick={() => onLikeBlog(blog.id)} style={{ marginLeft: 5 }}>like</button>
          </p>
          <p>{blog.user.name}</p>
          <div>
            <button onClick={() => onDeleteBlog(blog.id)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number,
    user: PropTypes.oneOfType([
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
      PropTypes.string,
    ]).isRequired,
  }).isRequired,
  onLikeBlog: PropTypes.func.isRequired,
  onDeleteBlog: PropTypes.func.isRequired,
}

export default Blog
