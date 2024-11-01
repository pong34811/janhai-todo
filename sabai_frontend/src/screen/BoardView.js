import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { URL_AUTH } from "../routes/CustomAPI";
import "./BoardView.css";
import { AiOutlineClose, AiOutlineSearch, AiOutlineBars } from "react-icons/ai";

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [editBoardTitle, setEditBoardTitle] = useState("");
  const [editBoard, setEditBoard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [createModal, setcreateModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = jwtDecode(token).user_id;

    if (!token) return navigate("/login");

    const username = localStorage.getItem("username");
    setUser({ username });

    const fetchBoards = async (userId) => {
      try {
        const { data } = await axios.get(
          `${URL_AUTH.BoardAPI}?user=${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBoards(data);
      } catch (error) {
        alert("Failed to load boards. Please try again.");
      }
    };

    fetchBoards(userId);
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
      setcreateModal(false);
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
  const toggleModal = () => {
    setcreateModal((prev) => !prev);
  };
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  return (
    <>
      <header className="header-board">
        <img src="/logo.png" className="img-board" alt="Logo" />
        <div className="group-board">
          <button onClick={toggleModal} className="btn-modal">
            Create
          </button>
        </div>
        <div className="search-board">
          <input
            type="text"
            placeholder="Search.."
            name="search"
            className="search-input-board"
          />
          <button type="submit" className="search-button-board">
            <AiOutlineSearch />
          </button>
        </div>

        <div className="user-board">
          <h2 className="username">{user.username}</h2>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="logout-button"
          >
            Logout
          </button>
        </div>
        <div className="toggle-board" onClick={toggleDropdown}>
          <AiOutlineBars />
        </div>
        {dropdownOpen && (
          <div className="dropdown-board">
            <div className="dropdown-content">
              <div className="group-board">
                <button onClick={toggleModal} className="btn-modal">
                  Create
                </button>
              </div>
              <div className="search-board">
                <input
                  type="text"
                  placeholder="Search.."
                  name="search"
                  className="search-input-board"
                />
                <button type="submit" className="search-button-board">
                  <AiOutlineSearch />
                </button>
              </div>
              <div className="user-board">
                <h2 className="username">{user.username}</h2>
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="logout-button"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <div className="main-board">
          <h1 className="h1-board">Boards</h1>
          <div className="work-board">
            <ul className="ul-board">
              {boards.map(({ id, title }) => (
                <li className="li-board" key={id}>
                  {editBoard && editBoard.id === id ? (
                    <input
                      type="text"
                      value={editBoardTitle}
                      onChange={(e) => setEditBoardTitle(e.target.value)}
                    />
                  ) : (
                    <h3>{title}</h3>
                  )}
                  <div className="title-board">
                    <button
                      className="button-edit"
                      onClick={() => {
                        if (editBoard && editBoard.id === id) {
                          handleBoardAction();
                        } else {
                          setEditBoard({ id, title });
                          setEditBoardTitle(title);
                        }
                      }}
                      disabled={loading}
                    >
                      {editBoard && editBoard.id === id ? "Save" : "Edit"}
                    </button>
                    <button
                      className="button-delete"
                      onClick={() => handleConfirmDelete(id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                    <button
                      className="button-view"
                      onClick={() => navigate(`/lists/${id}`)}
                      disabled={loading}
                    >
                      View Lists
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      {createModal && (
        <div className="modal-create">
          <div className="overlay-create"></div>
          <div className="modal-content-create">
            <h1>Create Board</h1>
            <button
              className="close-button-create"
              onClick={() => setcreateModal(false)}
            >
              <AiOutlineClose />
            </button>
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
        </div>
      )}
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
    </>
  );
};

export default Boards;
