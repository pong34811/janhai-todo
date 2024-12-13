import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { URL_AUTH } from "../routes/CustomAPI";
import {
  AiOutlineUser,
  AiOutlineBars,
  AiOutlineSearch,
  AiOutlineClose,
} from "react-icons/ai";
import { debounce } from "lodash"; // import debounce from lodash
import "./BoardView.css";
import "./HeaderBoard.css";
import "./MessageBoard.css";
import "./CreateModalBoard.css";
import "./ConfirmDeleteModal.css";
import "./SettingsModel.css";

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [editBoardTitle, setEditBoardTitle] = useState("");
  const [editBoard, setEditBoard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [user, setUser] = useState({});
  const [createModal, setCreateModal] = useState(false);
  const [SettingsModel, setSettingsModel] = useState(false);
  const [IsNavVisible, setIsNavVisible] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [message, setmessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  //ฟังก์ชัน ดึงข้อมูล API Boards ดึง user_id จาก token
  const fetchBoards = useCallback(async () => {
    const token = localStorage.getItem("token");
    const userId = jwtDecode(token).user_id;
    if (!token) return navigate("/login");

    setUser({ username: localStorage.getItem("username") });

    try {
      const { data } = await axios.get(
        `${URL_AUTH.BoardAPI}?user=${userId}&search=${searchQuery}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBoards(data);
    } catch (error) {
      setmessage("Failed to load boards. Please try again.");
    }
  }, [navigate, searchQuery]);

  // เรียกใช้ fetchBoards เมื่อ component โหลด
  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  // ดึงข้อมูลผู้ใช้จาก API // ดึง user_id จาก token
  const fetchUserDetails = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setmessage("Authentication failed. Please log in again.");
      return navigate("/login");
    }

    try {
      const { user_id } = jwtDecode(token); // ดึง user_id จาก token
      const { data } = await axios.get(`${URL_AUTH.UsersAPI}${user_id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(data); // เก็บข้อมูลผู้ใช้ที่ทำการล็อกอิน
      setmessage("User data loaded successfully!");
    } catch (error) {
      setmessage("Failed to load user data. Please try again.");
    }
  }, [navigate]);

  // เรียกใช้ fetchUserDetails เมื่อ component โหลด
  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  //ฟังก์ชัน setTimeout
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setmessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const debouncedSearch = debounce((e) => {
    setSearchQuery(e.target.value);
  }, 500);

  useEffect(() => {
    if (!searchQuery.trim()) return;

    const timer =
      boards.length === 0
        ? (setmessage("ไม่พบข้อมูลที่คุณค้นหา"),
          setTimeout(() => {
            setSearchQuery("");
          }, 1500))
        : setmessage("");

    return () => clearTimeout(timer);
  }, [boards, searchQuery]);

  const handleApiRequest = async (method, url, payload) => {
    const token = localStorage.getItem("token");
    return await axios({
      method,
      url,
      data: payload,
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  const createBoard = async () => {
    const token = localStorage.getItem("token");
    const userId = jwtDecode(token).user_id;

    if (!newBoardTitle.trim()) return;

    setLoading(true);
    try {
      const { data } = await handleApiRequest("post", URL_AUTH.BoardAPI, {
        title: newBoardTitle,
        user: userId,
      });
      setBoards((prev) => [...prev, data]);
      resetForm();
      setmessage("Board created successfully!");
    } catch (error) {
      setmessage("Failed to create board. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateBoard = async () => {
    if (!editBoardTitle.trim()) return;

    setLoading(true);
    const token = localStorage.getItem("token");
    const userId = jwtDecode(token).user_id;

    try {
      const { data } = await handleApiRequest(
        "put",
        `${URL_AUTH.BoardAPI}${editBoard.id}/`,
        {
          title: editBoardTitle,
          user: userId,
        }
      );
      setBoards((prev) =>
        prev.map((board) => (board.id === data.id ? data : board))
      );
      resetForm();
      setmessage("Board updated successfully!");
    } catch (error) {
      setmessage("Failed to update board. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBoardAction = async () => {
    if (editBoard) {
      await updateBoard();
    } else {
      await createBoard();
    }
  };

  const handleDeleteBoard = async (id) => {
    try {
      await handleApiRequest("delete", `${URL_AUTH.BoardAPI}${id}/`);
      setBoards((prev) => prev.filter((board) => board.id !== id));
      setConfirmDeleteId(null);
      setmessage("Board deleted successfully!");
    } catch (error) {
      setmessage("Failed to delete board. Please try again.");
    }
  };

  const resetForm = () => {
    setNewBoardTitle("");
    setCreateModal(false);
    setEditBoardTitle("");
    setEditBoard(null);
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

  const toggleModal = () => setCreateModal((prev) => !prev);
  const ModalSettingsModel = () => setSettingsModel((prev) => !prev);

  const toggleNav = () => setIsNavVisible(!IsNavVisible);
  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // ฟังก์ชันในการอัปเดตข้อมูลผู้ใช้
  const handleUpdateUser = async (updatedData) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    const userId = jwtDecode(token).user_id;

    try {
      const { data } = await axios.put(
        `${URL_AUTH.UsersAPI}${userId}/`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(data); // อัปเดตข้อมูลผู้ใช้ใน state
      setSettingsModel(false);
      setmessage("User data updated successfully!");
    } catch (error) {
      setmessage("Failed to update user data. Please try again.");
    }
  };

  return (
    <>
      {message && (
        <div className="message-box">
          <p>{message}</p>
        </div>
      )}
      <header className="header-board">
        <nav className="nav-board-1">
          <img className="img-board" src="/logo.png" alt="Logo" />
        </nav>
        {IsNavVisible && (
          <nav className="nav-board">
            <button className="create-btn" onClick={toggleModal}>
              Create
            </button>
            <div className="search-input">
              <AiOutlineSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search.."
                onChange={debouncedSearch}
              />
            </div>
            <div className="user-profile-list">
              <div className="dropdown">
                <button className="dropdown-toggle" onClick={toggleDropdown}>
                  <AiOutlineUser /> :{" "}
                  {user.first_name ? user.first_name : user.username}
                </button>
                {dropdownOpen && (
                  <ul className="dropdown-menu">
                    <li onClick={ModalSettingsModel}>Setting</li>
                    <li onClick={() => navigate("/change-password")}>
                      Change Password
                    </li>
                  </ul>
                )}
              </div>
            </div>
            <button
              className="logout-btn"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </nav>
        )}
        <button className="toggle-header" onClick={toggleNav}>
          <AiOutlineBars />
        </button>
      </header>

      <main>
        <div className="main-container">
          <div className="main-title-board">
            <h1>My Board Overview</h1>
            <p>
              💡"ที่นี่คุณสามารถดูและจัดการบอร์ดทั้งหมดของคุณได้ในที่เดียว
              จัดระเบียบ ติดตามความคืบหน้า
              และทำงานร่วมกันในโปรเจกต์ของคุณได้อย่างสะดวกและมีประสิทธิภาพ."
            </p>
          </div>
          <div className="work-container">
            <ul className="ul-board">
              {boards.length === 0 ? (
                <div className="no-boards-message">
                  <p>
                    ไม่พบข้อมูลในระบบ กรุณาทำการกดปุ่ม Create เพื่อสร้าง Board
                    ของคุณด้วยค่ะ
                  </p>
                </div>
              ) : (
                boards.map(({ id, title, created_at, updated_at }) => (
                  <li className="li-board" key={id}>
                    {editBoard?.id === id ? (
                      <input
                        type="text"
                        value={editBoardTitle}
                        onChange={(e) => setEditBoardTitle(e.target.value)}
                      />
                    ) : (
                      <div className="title-card-board">
                        <h3>Project: {title}</h3>
                      </div>
                    )}
                    <div className="button-card-board">
                      <button
                        className="button-edit-board"
                        onClick={() =>
                          editBoard?.id === id
                            ? handleBoardAction()
                            : (setEditBoard({ id, title }),
                              setEditBoardTitle(title))
                        }
                        disabled={loading}
                      >
                        {editBoard?.id === id ? "Save" : "Edit"}
                      </button>
                      <button
                        className="button-delete-board"
                        onClick={() => setConfirmDeleteId(id)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                      <button
                        className="button-view-board"
                        onClick={() => navigate(`/lists/${id}`)}
                        disabled={loading}
                      >
                        View
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </main>

      {createModal && (
        <div className="modal-create-board">
          <div className="modal-content">
            <h2>Create a New Board</h2>
            <input
              type="text"
              placeholder="Board Title"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
            />
            <div className="modal-footer">
              <button className="cancel-modal-board" onClick={toggleModal}>
                Cancel
              </button>
              <button
                className="create-modal-board"
                onClick={createBoard}
                disabled={loading || !newBoardTitle.trim()}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmDeleteId && (
        <div className="confirm-delete-modal">
          <div className="confirm-delete-container">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this board?</p>
            <button
              className="confirm-modal-board"
              onClick={() => handleDeleteBoard(confirmDeleteId)}
            >
              Yes, delete
            </button>
            <button className="cancel-modal-board" onClick={handleCloseModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {SettingsModel && (
        <div className="SettingsModel-container">
          <div className="SettingsModel-Model">
            <div className="header-settings">
              <h2>Settings</h2>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser(user);
              }}
              className="settings-form"
            >
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  value={user.first_name || ""}
                  onChange={(e) =>
                    setUser({ ...user, first_name: e.target.value })
                  }
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  value={user.last_name || ""}
                  onChange={(e) =>
                    setUser({ ...user, last_name: e.target.value })
                  }
                  placeholder="Last Name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={user.email || ""}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="form-group">
                <div>
                  {" "}
                  <label htmlFor="last_login">Last Login</label>
                </div>

                <input
                  type="text"
                  id="last_login"
                  value={user.last_login || ""}
                  disabled
                  placeholder="Last Login"
                />
              </div>
              <button type="submit" className="update-btn">
                Update
              </button>
            </form>
            <button className="close-settings-btn" onClick={ModalSettingsModel}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Boards;
