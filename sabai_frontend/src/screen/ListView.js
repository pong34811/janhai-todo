import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { URL_AUTH } from "../routes/CustomAPI";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FiPlus, FiMoreHorizontal, FiEdit, FiTrash2 } from "react-icons/fi";
import "./ListView.css";

const ListView = () => {
  const { id: boardId } = useParams();
  const [lists, setLists] = useState([]);
  const [listTitle, setListTitle] = useState("");
  const [isAddingList, setIsAddingList] = useState(false);
  const [activeOptionsId, setActiveOptionsId] = useState(null);
  const [editingListId, setEditingListId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const fetchLists = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.get(`${URL_AUTH.ListsAPI}?board=${boardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedLists = data.sort((a, b) => a.order - b.order);
      setLists(sortedLists);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  }, [boardId]);

  useEffect(() => {
    fetchLists();
  }, [fetchLists]);

  const reorderLists = async (newLists) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const updatePromises = newLists.map((list, index) =>
        axios.patch(
          `${URL_AUTH.ListsAPI}${list.id}/`,
          { order: index + 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Error reordering lists:", error);
    }
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    const reorderedLists = Array.from(lists);
    const [removed] = reorderedLists.splice(source.index, 1);
    reorderedLists.splice(destination.index, 0, removed);

    setLists(reorderedLists); // Optimistic update
    reorderLists(reorderedLists); // Sync with backend
  };

  const addList = async () => {
    if (!listTitle.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.post(
        URL_AUTH.ListsAPI,
        {
          title: listTitle,
          board: boardId,
          order: lists.length + 1,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLists((prev) => [...prev, data]);
      resetListInput();
    } catch (error) {
      console.error("Error adding list:", error);
    }
  };

  const updateList = async () => {
    if (!editTitle.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.patch(
        `${URL_AUTH.ListsAPI}${editingListId}/`,
        { title: editTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLists((prev) =>
        prev.map((list) => (list.id === editingListId ? data : list))
      );
      resetEditMode();
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  const deleteList = async (listId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.delete(`${URL_AUTH.ListsAPI}${listId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLists((prev) => prev.filter((list) => list.id !== listId));
      setActiveOptionsId(null);
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  const resetListInput = () => {
    setListTitle("");
    setIsAddingList(false);
  };

  const resetEditMode = () => {
    setEditingListId(null);
    setEditTitle("");
    setActiveOptionsId(null);
  };

  const toggleOptionsMenu = (listId) => {
    setActiveOptionsId((prev) => (prev === listId ? null : listId));
  };

  const startEditing = (list) => {
    setEditingListId(list.id);
    setEditTitle(list.title);
    setActiveOptionsId(null);
  };

  const MemoizedList = useMemo(() => {
    return lists.map((list, index) => (
      <Draggable key={list.id} draggableId={list.id.toString()} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`list-card ${
              snapshot.isDragging ? "react-beautiful-dnd-draggable--isDragging" : ""
            }`}
          >
            <div className="list-header">
              {editingListId === list.id ? (
                <div className="edit-input-group">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="input-title"
                    autoFocus
                  />
                  <div className="edit-button-group">
                    <button onClick={updateList} className="button-save">
                      Save
                    </button>
                    <button onClick={resetEditMode} className="button-cancel">
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="list-title">{list.title}</h3>
                  <div className="list-options-container">
                    <button
                      className="options-button"
                      onClick={() => toggleOptionsMenu(list.id)}
                    >
                      <FiMoreHorizontal />
                    </button>
                    {activeOptionsId === list.id && (
                      <div className="options-popover">
                        <button
                          onClick={() => startEditing(list)}
                          className="popover-option"
                        >
                          <FiEdit /> Edit
                        </button>
                        <button
                          onClick={() => deleteList(list.id)}
                          className="popover-option delete"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <button className="add-card-button">
              <FiPlus />
              <span>Add a card</span>
            </button>
          </div>
        )}
      </Draggable>
    ));
  }, [lists, editingListId, activeOptionsId, editTitle]);

  return (
    <div id="list-view">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="lists" direction="horizontal">
          {(provided) => (
            <div
              id="lists-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {MemoizedList}
              {provided.placeholder}
  
              {!isAddingList && (
                <button
                  onClick={() => setIsAddingList(true)}
                  className="add-list-button"
                >
                  <FiPlus />
                  <span>Add another list</span>
                </button>
              )}
              {isAddingList && (
                <div className="list-card list-input">
                  <input
                    type="text"
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                    placeholder="Enter list title..."
                    className="input-title"
                    autoFocus
                  />
                  <div className="button-group">
                    <button onClick={addList} className="button-add">
                      Add list
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingList(false);
                        setListTitle("");
                      }}
                      className="button-cancel"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
  
};

export default ListView;