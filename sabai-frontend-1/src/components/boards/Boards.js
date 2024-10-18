import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [editBoard, setEditBoard] = useState({ id: null, title: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    fetchBoards(token);
  }, [navigate]);

  const fetchBoards = async (token) => {
    try {
      const { data } = await axios.get('http://localhost:8000/api/boards/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBoards(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleApiRequest = async (method, url, data) => {
    const token = localStorage.getItem('token');
    try {
      return await axios[method](url, data, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      console.error(error);
      alert(`Failed to ${method === 'delete' ? 'delete' : 'update'} board.`);
    }
  };

  const handleBoardAction = async (action) => {
    const { title } = action === 'create' ? { title: newBoardTitle } : editBoard;
    if (!title.trim()) return alert('Please enter a board title.');

    const user_id = jwtDecode(localStorage.getItem('token')).user_id;
    const url = action === 'create' ? 'http://localhost:8000/api/boards/' : `http://localhost:8000/api/boards/${editBoard.id}/`;
    const method = action === 'create' ? 'post' : 'put';

    const { data } = await handleApiRequest(method, url, { title, user: user_id });
    if (data) {
      setBoards((prev) => action === 'create' ? [...prev, data] : prev.map(b => (b.id === data.id ? data : b)));
      if (action === 'create') setNewBoardTitle('');
      else setEditBoard({ id: null, title: '' });
    }
  };

  const handleDeleteBoard = async (id) => {
    await handleApiRequest('delete', `http://localhost:8000/api/boards/${id}/`);
    setBoards((prev) => prev.filter(board => board.id !== id));
  };

  return (
    <div>
      <h1>Boards</h1>
      <button onClick={handleLogout}>Logout</button>

      <h2>Create New Board</h2>
      <input type="text" value={newBoardTitle} onChange={(e) => setNewBoardTitle(e.target.value)} placeholder="Enter board title" />
      <button onClick={() => handleBoardAction('create')}>Create</button>

      <h2>Edit Board</h2>
      {editBoard.id && (
        <div>
          <input type="text" value={editBoard.title} onChange={(e) => setEditBoard({ ...editBoard, title: e.target.value })} placeholder="Edit board title" />
          <button onClick={() => handleBoardAction('update')}>Update</button>
          <button onClick={() => setEditBoard({ id: null, title: '' })}>Cancel</button>
        </div>
      )}

      <ul>
        {boards.map(({ id, title }) => (
          <li key={id}>
            {title}
            <button onClick={() => setEditBoard({ id, title })}>Edit</button>
            <button onClick={() => handleDeleteBoard(id)}>Delete</button>
            <button onClick={() => navigate(`/lists/${id}`)}>View Lists</button> {/* Add View Lists button */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Boards;
