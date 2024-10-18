import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ListView = () => {
  const { id } = useParams(); // ดึง ID จาก URL
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      const token = localStorage.getItem('token'); // ดึง token จาก localStorage
      try {
        const response = await axios.get(`http://localhost:8000/api/lists/?board=${id}`, {
          headers: { Authorization: `Bearer ${token}` }, // ส่ง token ใน headers
        });
        setLists(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchLists();
  }, [id]);

  return (
    <div>
      <h1>Lists for Board ID: {id}</h1>
      <ul>
        {lists.map(list => (
          <li key={list.id}>{list.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default ListView;
