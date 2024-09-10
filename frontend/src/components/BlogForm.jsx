import { useState } from 'react';
import PropTypes from 'prop-types';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleCreateBlog = (event) => {
    event.preventDefault();
    createBlog({
      title,
      author,
      url
    });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <form onSubmit={handleCreateBlog}>
      <div>
        Title: <input value={title} onChange={({ target }) => setTitle(target.value)} />
      </div>
      <div>
        Author: <input value={author} onChange={({ target }) => setAuthor(target.value)} />
      </div>
      <div>
        URL: <input value={url} onChange={({ target }) => setUrl(target.value)} />
      </div>
      <button type="submit">Create</button>
    </form>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
};

export default BlogForm;