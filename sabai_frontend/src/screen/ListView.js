import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { URL_AUTH } from '../routes/CustomAPI';

const ListView = () => {
  const { id } = useParams();
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`${URL_AUTH.ListsAPI}?board=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
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