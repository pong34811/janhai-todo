import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const Board = () => {
    const [boards, setBoards] = useState([]);
    const [title, setTitle] = useState('');
    const [editingBoardId, setEditingBoardId] = useState(null);

    // ฟังก์ชันดึงข้อมูลบอร์ด
    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://localhost:8000/api/boards/', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setBoards(response.data);
    };

    // ฟังก์ชันสร้างบอร์ดใหม่
    const createBoard = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        const userId = jwtDecode(token).user_id; // ดึง userId จาก token
        await axios.post('http://localhost:8000/api/boards/', { title, user: userId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setTitle('');
        fetchBoards(); // รีเฟรชข้อมูลบอร์ด
    };

    // ฟังก์ชันแก้ไขบอร์ด
    const editBoard = async (boardId) => {
        if (!title) {
            alert('กรุณากรอกชื่อบอร์ด');
            return;
        }

        const token = localStorage.getItem('access_token');
        const userId = jwtDecode(token).user_id; // ดึง userId จาก token

        try {
            await axios.put(`http://localhost:8000/api/boards/${boardId}/`, {
                title,
                user: userId, // ส่ง user ID ที่เป็นเจ้าของบอร์ด
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTitle('');
            setEditingBoardId(null);
            fetchBoards(); // รีเฟรชข้อมูลบอร์ด
        } catch (error) {
            console.error('Error updating board:', error.response.data);
            alert('เกิดข้อผิดพลาดในการอัปเดตบอร์ด: ' + error.response.data.detail);
        }
    };

    // ฟังก์ชันลบบอร์ด
    const deleteBoard = async (boardId) => {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://localhost:8000/api/boards/${boardId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        fetchBoards(); // รีเฟรชข้อมูลบอร์ด
    };

    return (
        <div>
            <h2>Board</h2>
            <form onSubmit={editingBoardId ? (e) => { e.preventDefault(); editBoard(editingBoardId); } : createBoard}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <button type="submit">{editingBoardId ? 'Update' : 'Create'}</button>
            </form>
            <ul>
                {boards.map((board) => (
                    <li key={board.id}>
                        {board.title}
                        <button onClick={() => { setEditingBoardId(board.id); setTitle(board.title); }}>Edit</button>
                        <button onClick={() => deleteBoard(board.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Board;
