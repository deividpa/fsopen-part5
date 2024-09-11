import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, onLikeBlog, onDeleteBlog }) => {
    const [visible, setVisible] = useState(false);

  const blogStyle = {
    padding: 15,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const toggleVisibility = () => {
        setVisible(!visible);
  };

  return (
    <div style={blogStyle}>
        <div>
            {blog.title} {blog.author}{' '}
            <button onClick={toggleVisibility}>
            {visible ? 'hide' : 'view'}
            </button>
        </div>
        {visible && (
            <div>
                <p>{blog.url}</p>
                <p>
                    likes: {blog.likes}
                    <button onClick={() => onLikeBlog(blog.id)} style={{marginLeft: 5}}>like</button>
                </p>
                <p>{blog.user.name}</p>
                <div>
                    <button onClick={() => onDeleteBlog(blog.id)}>Delete</button>
                </div>
            </div>
        )}
    </div>
  );
};

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    onLikeBlog: PropTypes.func.isRequired,
    onDeleteBlog: PropTypes.func.isRequired,
};

export default Blog;
