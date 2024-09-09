import axios from 'axios';
const baseUrl = '/api/blogs';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newBlog, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const update = async (id, updatedBlog, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config);
  return response.data;
};

const deleteBlog = async (id, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

export default { getAll, create, update, deleteBlog }