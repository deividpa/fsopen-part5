import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, onLikeBlog, onDeleteBlog, currentUsername = null }) => {
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

  // Check if the current user is the owner of the blog
  const isOwner = currentUsername && currentUsername === blog.user.username

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
          <div>
            <span>URL:</span>
            <span>{blog.url}</span>
          </div>
          <div>
            <div>
              <span style={{marginRight: 3}}>likes:</span>
              <span className='likes-count'>{blog.likes}</span>
            </div>
            <button onClick={() => onLikeBlog(blog.id)} style={{ margin: 2 }}>like</button>
          </div>
          <div>
            <span>Added by:</span>
            <span>{blog.user.name}</span>
          </div>  
          <div>
            <span>Current username:</span>
            <span>{currentUsername}</span>
          </div>  
          <div>
            {isOwner && (
              <button onClick={() => onDeleteBlog(blog.id)} style={{ margin: 2 }}>Delete</button>
            )}
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
    user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onLikeBlog: PropTypes.func.isRequired,
  onDeleteBlog: PropTypes.func.isRequired,
  currentUserId: PropTypes.string
}

export default Blog
