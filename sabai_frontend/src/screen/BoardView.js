import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { URL_AUTH } from "../routes/CustomAPI";
import "./BoardView.css";

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [editBoardTitle, setEditBoardTitle] = useState("");
  const [editBoard, setEditBoard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const username = localStorage.getItem("username");
    setUser({ username });

    const fetchBoards = async () => {
      try {
        const { data } = await axios.get(URL_AUTH.BoardAPI, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBoards(data);
      } catch (error) {
        alert("Failed to load boards. Please try again.");
      }
    };

    fetchBoards();
  }, [navigate]);

  const handleApiRequest = async (method, url, payload) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    return await axios({ method, url, data: payload, ...config });
  };

  const handleBoardAction = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const userId = jwtDecode(token).user_id;
    const isEditing = !!editBoard;
    const url = isEditing
      ? `${URL_AUTH.BoardAPI}${editBoard.id}/`
      : URL_AUTH.BoardAPI;
    const method = isEditing ? "put" : "post";
    const payload = {
      title: isEditing ? editBoardTitle : newBoardTitle,
      user: userId,
    };

    if (!payload.title.trim()) {
      alert("Please enter a board title.");
      setLoading(false);
      return;
    }

    try {
      const { data } = await handleApiRequest(method, url, payload);
      setBoards((prev) =>
        isEditing
          ? prev.map((b) => (b.id === data.id ? data : b))
          : [...prev, data]
      );
      setNewBoardTitle("");
      setEditBoardTitle("");
      setEditBoard(null);
    } catch (error) {
      alert(error.response?.data?.detail || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBoard = async (id) => {
    try {
      await handleApiRequest("delete", `${URL_AUTH.BoardAPI}${id}/`);
      setBoards((prev) => prev.filter((board) => board.id !== id));
      setConfirmDeleteId(null);
    } catch (error) {
      alert("Failed to delete board. Please try again.");
    }
  };

  const handleConfirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleCloseModal = () => {
    setConfirmDeleteId(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <>
      <header className="header-board">
        <div className="group">
          <img src="/logo.png" className="item-img" alt="Logo" />
        </div>
        <div className="group">
          <h2>{user.username || "Guest"}</h2>
          <button onClick={handleLogout} disabled={loading}>
            Logout
          </button>
        </div>
      </header>
      <div>
        <h1>Boards</h1>

        <div>
          <h2>Create Board</h2>
          <input
            type="text"
            value={newBoardTitle}
            onChange={(e) => setNewBoardTitle(e.target.value)}
            placeholder="Enter board title"
            disabled={loading || !!editBoard}
          />
          <button
            onClick={handleBoardAction}
            disabled={loading || !newBoardTitle.trim() || editBoard}
          >
            Create
          </button>
        </div>

        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            padding: "0",
            listStyleType: "none",
          }}
        >
          {boards.map(({ id, title }) => (
            <li
              key={id}
              style={{
                background: "#fff",
                border: "1px solid #e2e2e2",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                width: "220px",
              }}
            >
              {editBoard && editBoard.id === id ? (
                <input
                  type="text"
                  value={editBoardTitle}
                  onChange={(e) => setEditBoardTitle(e.target.value)}
                  style={{ marginBottom: "8px", width: "100%" }}
                />
              ) : (
                <h3 style={{ margin: "0 0 8px" }}>{title}</h3>
              )}
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={() => {
                    if (editBoard && editBoard.id === id) {
                      handleBoardAction();
                    } else {
                      setEditBoard({ id, title });
                      setEditBoardTitle(title);
                    }
                  }}
                  disabled={loading}
                  style={{
                    flex: "1",
                    padding: "8px",
                    background: "#0079BF",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {editBoard && editBoard.id === id ? "Save" : "Edit"}
                </button>
                <button
                  onClick={() => handleConfirmDelete(id)}
                  disabled={loading}
                  style={{
                    flex: "1",
                    padding: "8px",
                    background: "#D50000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
                <button
                  onClick={() => navigate(`/lists/${id}`)}
                  disabled={loading}
                  style={{
                    flex: "1",
                    padding: "8px",
                    background: "#5AAC44",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  View Lists
                </button>
              </div>
            </li>
          ))}
        </ul>

        {confirmDeleteId && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
                width: "300px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h2>Confirm Delete</h2>
              <p>Are you sure you want to delete this board?</p>
              <button onClick={() => handleDeleteBoard(confirmDeleteId)}>
                Yes, delete
              </button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Boards;
