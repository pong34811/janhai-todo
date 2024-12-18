import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import {  FiEdit, FiTrash2 } from "react-icons/fi";
import TaskCard from "./TaskCard";
import axios from "axios";
import { URL_AUTH } from "../routes/CustomAPI";
import "./ListCard.css";

const ListCard = ({ list, index, setLists }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);

  const updateList = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.patch(
        `${URL_AUTH.ListsAPI}${list.id}/`,
        { title: editTitle },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLists((prev) => prev.map((l) => (l.id === list.id ? data : l)));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  const deleteList = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${URL_AUTH.ListsAPI}${list.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLists((prev) => prev.filter((l) => l.id !== list.id));
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  return (
    <Draggable draggableId={`list-${list.id}`} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="list-card-container"
        >
          {isEditing ? (
            <div className="list-edit">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={updateList}
                autoFocus
              />
              <button onClick={updateList}>Save</button>
            </div>
          ) : (
            <div className="list-header">
              <div className="list-header-title">
                <p>{list.title}</p>
              </div>
              <div>
                <FiEdit onClick={() => setIsEditing(true)} />
                <FiTrash2 onClick={deleteList} />
              </div>
            </div>
          )}
          <TaskCard list={list} setLists={setLists} />
        </div>
      )}
    </Draggable>
  );
};

export default ListCard;
