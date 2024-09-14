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
        Title: 
        <input 
          value={title} 
          onChange={({ target }) => setTitle(target.value)} 
          placeholder={"Enter blog title"} 
        />
      </div>
      <div>
        Author: 
        <input 
          value={author} 
          onChange={({ target }) => setAuthor(target.value)} 
          placeholder={'Enter blog author'} 
        />
      </div>
      <div>
        URL: 
        <input 
          value={url} 
          onChange={({ target }) => setUrl(target.value)} 
          placeholder={'Enter blog URL'} 
        />
      </div>
      <button type="submit" id="createBlog">Create</button>
    </form>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
};

export default BlogForm;