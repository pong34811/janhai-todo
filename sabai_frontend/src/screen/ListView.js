import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { FiPlus } from "react-icons/fi";
import ListCard from "./ListCard";
import { URL_AUTH } from "../routes/CustomAPI";
import "./ListView.css";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AiOutlineUser } from "react-icons/ai";

const ListView = () => {
  const { id: boardId } = useParams();
  const [lists, setLists] = useState([]);
  const [isAddingList, setIsAddingList] = useState(false);
  const [listTitle, setListTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const [boards, setBoards] = useState([]);
  const [message, setmessage] = useState("");
  const [messageform, setmessageform] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [SettingsModel, setSettingsModel] = useState(false);
  const [ChangePasswordModal, setChangePasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const navigate = useNavigate();

  const fetchLists = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing");

      const { data } = await axios.get(
        `${URL_AUTH.ListsAPI}?board=${boardId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLists(data.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError(`Error fetching lists: ${err.message || err.response?.data}`);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    setUser({ username: localStorage.getItem("username") });
    fetchLists();
  }, [fetchLists]);

  const onDragEnd = async ({ destination, source, type }) => {
    if (!destination) return;

    const updatedLists = [...lists];
    const movedTask =
      type === "task"
        ? updatedLists
          .find((list) => list.id === +source.droppableId.split("-")[1])
          ?.tasks.splice(source.index, 1)
        : null;

    if (type === "list" && source.index !== destination.index) {
      const [movedList] = updatedLists.splice(source.index, 1);
      updatedLists.splice(destination.index, 0, movedList);
      setLists(updatedLists);
      await updateListOrder(updatedLists);
    } else if (movedTask) {
      const destListId = +destination.droppableId.split("-")[1];
      const destList = updatedLists.find((list) => list.id === destListId);
      destList.tasks.splice(destination.index, 0, movedTask[0]);
      setLists(updatedLists);
      await updateTaskPosition(movedTask[0].id, destListId, destination.index);
    }
  };

  const updateListOrder = async (updatedLists) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    await Promise.all(
      updatedLists.map((list, index) =>
        axios.patch(
          `${URL_AUTH.ListsAPI}${list.id}/`,
          { order: index + 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      )
    );
  };

  const updateTaskPosition = async (taskId, listId, order, taskTitle) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    try {
      const { data: currentTask } = await axios.get(
        `${URL_AUTH.TasksAPI}${taskId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedTitle = taskTitle || currentTask.title;
      if (!updatedTitle) throw new Error("Task title cannot be empty");

      const response = await axios.patch(
        `${URL_AUTH.TasksAPI}${taskId}/`,
        {
          title: updatedTitle,
          list: listId,
          order: order + 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data || err.message;
      console.error(`Failed to update task position: ${errorMessage}`);
      throw new Error(`Failed to update task position: ${errorMessage}`);
    }
  };

  const addList = async () => {
    if (!listTitle.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        URL_AUTH.ListsAPI,
        { title: listTitle, board: boardId, order: lists.length + 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLists((prev) => [...prev, data]);
      setListTitle("");
      setIsAddingList(false);
    } catch (err) {
      setError(`Error adding list: ${err.message || err.response?.data}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    sessionStorage.clear();
    navigate("/login");
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userId = jwtDecode(token).user_id;

      // ดึงข้อมูลบอร์ดจาก API
      axios
        .get(`${URL_AUTH.BoardAPI}?user=${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setBoards(response.data); // เก็บข้อมูลบอร์ด
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching boards:", error);
          setLoading(false);
        });
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);

  };
  const ModalSettingsModel = () => setSettingsModel((prev) => !prev);
  const showChangePasswordModal = () => setChangePasswordModal((prev) => !prev);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setmessageform(""); // เคลียร์ข้อความเก่า

    // Validate passwords match
    if (passwordData.new_password !== passwordData.confirm_password) {
      setmessageform("New passwords do not match");
      return;
    }

    const token = localStorage.getItem("token"); // ดึง access_token จาก localStorage
    if (!token) {
      setmessageform("Authentication failed. Please log in again.");
      return; // ออกจากฟังก์ชันถ้าไม่มี Token
    }

    try {
      await axios.post(
        URL_AUTH.ChangePasswordAPI, // ใช้ URL ที่ปรับปรุงใน CustomAPI.js
        {
          old_password: passwordData.old_password,
          new_password: passwordData.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง Token สำหรับการยืนยันตัวตน
          },
        }
      );
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
      setChangePasswordModal(); // ปิด Modal หลังจากเปลี่ยนรหัสสำเร็จ
      setmessage("Password changed successfully");
    } catch (error) {
      // แสดงข้อความ error จาก response
      setmessageform(
        error.response?.data?.old_password ||
        error.response?.data?.new_password ||
        "Failed to change password"
      );
    }
  };

  // ดึงข้อมูลผู้ใช้จาก API fetchUserDetails // ดึง user_id จาก token
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
    } catch (error) {
      setmessage("Failed to load user data. Please try again.");
    }
  }, [navigate]);

  // เรียกใช้ fetchUserDetails เมื่อ component โหลด
  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

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
  //ฟังก์ชัน setTimeout
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setmessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  //ฟังก์ชัน setTimeout
  useEffect(() => {
    if (dropdownOpen) {
      const timer = setTimeout(() => {
        setDropdownOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [dropdownOpen]);

  return (
    <>
      {message && (
        <div className="message-box">
          <p>{message}</p>
        </div>
      )}
      <header className="header-board">
        <nav className="nav-board-1">
          <Link to="/boards">
            <img className="img-board" src="/logo.png" alt="Logo" />
          </Link>
        </nav>
        <nav className="nav-board">
          <div className="user-profile-list">
            <div className="dropdown">
              <button className="dropdown-toggle" onClick={toggleDropdown}>
                <AiOutlineUser /> :{" "}
                {user.first_name ? user.first_name : user.username}
              </button>
              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li onClick={setSettingsModel}>Setting</li>
                  <li onClick={setChangePasswordModal}>Change Password</li>
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
      </header>

      <div className="list-view">
        <aside className="sidenav">
          <h3 className="sidenav-subtitle">My Boards</h3>
          <ul className="sidenav-menu">
            {boards.map((board) => (
              <li key={board.id}>
                <Link to={`/lists/${board.id}`}>
                  <i className="fas fa-clipboard"></i> {board.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {loading && <div className="loading-spinner">Loading...</div>}
        {error && <div className="error-message">{error}</div>}

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="lists" direction="horizontal" type="list">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                id="lists-container"
                className="lists-container"
              >
                {lists.map((list, index) => (
                  <ListCard
                    key={list.id}
                    list={list}
                    index={index}
                    setLists={setLists}
                  />
                ))}
                {provided.placeholder}

                {isAddingList ? (
                  <div className="add-list-card">
                    <input
                      className="list-card-input"
                      value={listTitle}
                      onChange={(e) => setListTitle(e.target.value)}
                      placeholder="Enter list title..."
                      autoFocus
                    />
                    <button className="list-card-add" onClick={addList}>
                      Save
                    </button>
                    <button
                      className="list-card-cancel"
                      onClick={() => setIsAddingList(false)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className="add-list-button"
                    onClick={() => setIsAddingList(true)}
                  >
                    <FiPlus /> Add List
                  </button>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

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
      {ChangePasswordModal && (
        <div className="SettingsModel-container">
          <div className="SettingsModel-Model">
            <div className="header-settings">
              <h2>Change Password</h2>
            </div>
            <form onSubmit={handlePasswordChange} className="settings-form">
              {messageform && (
                <div
                  className="message"
                  style={{ color: "red", marginBottom: "10px" }}
                >
                  {messageform}
                </div>
              )}
              <div className="form-group">
                <label htmlFor="old_password">Current Password</label>
                <input
                  type="password"
                  id="old_password"
                  value={passwordData.old_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      old_password: e.target.value,
                    })
                  }
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="new_password">New Password</label>
                <input
                  type="password"
                  id="new_password"
                  value={passwordData.new_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      new_password: e.target.value,
                    })
                  }
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm_password">Confirm New Password</label>
                <input
                  type="password"
                  id="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirm_password: e.target.value,
                    })
                  }
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button type="submit" className="update-btn">
                Change Password
              </button>
            </form>
            <button
              className="close-settings-btn"
              onClick={showChangePasswordModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ListView;
