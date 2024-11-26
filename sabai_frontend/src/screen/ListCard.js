import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { FiMoreHorizontal, FiEdit, FiTrash2 } from "react-icons/fi";
import TaskCard from "./TaskCard";
import axios from "axios";
import { URL_AUTH } from "../routes/CustomAPI";
import "./ListCard.css"; 

const ListCard = ({ list, index, setLists }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);

  // Function to update the list title
  const updateList = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.patch(
        `${URL_AUTH.ListsAPI}${list.id}/`,
        { title: editTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update the list in the UI
      setLists((prev) => prev.map((l) => (l.id === list.id ? data : l)));
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  // Function to delete the list
  const deleteList = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${URL_AUTH.ListsAPI}${list.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove the list from the UI
      setLists((prev) => prev.filter((l) => l.id !== list.id));
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  return (
    <Draggable draggableId={list.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="list-card"
        >
          <div className="list-header">
            {isEditing ? (
              <div className="edit-list-title">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  autoFocus
                />
                <button onClick={updateList}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            ) : (
              <>
                <h3>{list.title}</h3>
                <div className="list-actions">
                  <FiEdit onClick={() => setIsEditing(true)} />
                  <FiTrash2 onClick={deleteList} />
                </div>
              </>
            )}
          </div>
          <TaskCard list={list} setLists={setLists} />
        </div>
      )}
    </Draggable>
  );
};

export default ListCard;
