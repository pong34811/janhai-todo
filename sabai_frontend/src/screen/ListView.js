import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { FiPlus } from "react-icons/fi";
import ListCard from "./ListCard";
import { URL_AUTH } from "../routes/CustomAPI";
import "./ListView.css";

const ListView = () => {
  const { id: boardId } = useParams();
  const [lists, setLists] = useState([]);
  const [isAddingList, setIsAddingList] = useState(false);
  const [listTitle, setListTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLists = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing");

      const { data } = await axios.get(`${URL_AUTH.ListsAPI}?board=${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLists(data.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError(`Error fetching lists: ${err.message || err.response?.data}`);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const onDragEnd = async ({ destination, source, type }) => {
    if (!destination) return;

    const updatedLists = [...lists];
    const movedTask = type === "task"
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
      console.error("Authentication token missing");
      return;
    }

    try {
      const { data: currentTask } = await axios.get(`${URL_AUTH.TasksAPI}${taskId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });

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

  return (
    <div id="list-view">
      {loading && <div className="loading-spinner">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="lists" direction="horizontal" type="list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              id="lists-container"
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
                <div className="list-card list-input">
                  <input
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                    placeholder="Enter list title..."
                    autoFocus
                  />
                  <button onClick={addList}>Add</button>
                  <button onClick={() => setIsAddingList(false)}>Cancel</button>
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
  );
};

export default ListView;