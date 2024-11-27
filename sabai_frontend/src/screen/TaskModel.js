import axios from "axios";
import { URL_AUTH } from "../routes/CustomAPI";

export const handleTaskAction = async (action, taskId = null, data = {}, listId, setLists) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    return;
  }
  
  const url = taskId ? `${URL_AUTH.TasksAPI}${taskId}/` : `${URL_AUTH.TasksAPI}`;
  try {
    let response;
    const config = { headers: { Authorization: `Bearer ${token}` } };

    // Perform API actions based on the action type
    if (action === "add" && data.title.trim()) {
      response = await axios.post(
        url,
        {
          title: data.title,
          list: listId,
          order: data.order || 1,
        },
        config
      );
    } else if (action === "delete" && taskId) {
      response = await axios.delete(url, config);
    } else if (action === "edit" && data) {
      response = await axios.put(url, data, config);
    } else {
      return; // Return early if no valid action or data
    }

    // Update the task list after a successful API call
    setLists((prevLists) => {
      return prevLists.map((list) => {
        if (list.id !== listId) return list; // Skip lists that don't match
        const updatedTasks = list.tasks.map((task) => {
          if (task.id === taskId) {
            return action === "edit" ? response.data : task; // Update task if it's an edit
          }
          return task;
        });

        // Add or delete task based on the action
        if (action === "add") {
          updatedTasks.push(response.data); // Add new task
        } else if (action === "delete") {
          return {
            ...list,
            tasks: updatedTasks.filter((task) => task.id !== taskId), // Remove task
          };
        }

        return {
          ...list,
          tasks: updatedTasks,
        };
      });
    });
  } catch (error) {
    console.error(`${action} task error:`, error);
    // Provide better user feedback here
  }
};
