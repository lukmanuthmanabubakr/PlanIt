import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteTask,
  getAllTasksAdmin,
  resetState,
} from "../../../redux/features/task/taskSlice";
import { toast } from "react-toastify";
import { IoEllipsisVertical } from "react-icons/io5"; // Menu icon
import "./AdminTasks.css";
import AddNewTask from "../../../components/AddNewTask/AddNewTask";
import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser";
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";
import { TbSubtask } from "react-icons/tb";
import Notification from "../../../components/Notification/Notification";

export const shortenDes = (text, wordLimit = 10) => {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return text;
};
export const shortenTitle = (text, wordLimit = 5) => {
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return text;
};

const AdminTasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useRedirectLoggedOutUser("/login");

  const { tasks, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.tasks
  );
  const { user } = useSelector((state) => state.auth);

  const initialState = {
    isVerified: user?.isVerified ?? null,
  };

  const [profile, setProfile] = useState(initialState);

  const [isModalOpen, setModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null); // Track open menu

  // Fetch tasks and ensure they are sorted by createdAt in descending order
  useEffect(() => {
    // Fetch tasks, ensuring the most recent tasks are at the top (sort by createdAt in descending order)
    dispatch(getAllTasksAdmin({ sortBy: "createdAt:desc" }));

    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess && message) toast.success(message);
  }, [isError, isSuccess, message]);

  const handleDeleteTask = (id) => {
    setTaskToDelete(id);
    setModalOpen(true);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete));
      setModalOpen(false);
      setTaskToDelete(null);
    }
  };

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess && message) toast.success(message);
  }, [isError, isSuccess, message]);

  const handleTaskClick = (id) => {
    navigate(`/get-task/${id}`);
  };

  const handleUpdateTask = (id) => {
    navigate(`/update-task/${id}`); // Navigate to update task page
  };

  return (
    <>
      {!isLoading && profile.isVerified === false && <Notification />}
      <div className="admin-tasks">
        <h1 className="tasks-heading">All Tasks</h1>
        {isLoading ? (
          <p className="loading-message">Loading tasks...</p>
        ) : tasks.length > 0 ? (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={`task-card status-${task.status.toLowerCase()}`}
                style={{ position: "relative" }} // For menu positioning
              >
                <div
                  onClick={() => handleTaskClick(task._id)}
                  style={{ cursor: "pointer" }}
                >
                  <h3 className="task-title">{shortenTitle(task.title)}</h3>
                  <p className="task-desc">{shortenDes(task.description)}</p>
                  {task.subtasks.length > 0 && (
                    <div className="subtask-icon">
                      <TbSubtask title="Has Subtasks" />
                    </div>
                  )}
                </div>
                <div className="menu-wrapper">
                  <IoEllipsisVertical
                    className="menu-icon"
                    onClick={() =>
                      setActiveMenu(activeMenu === task._id ? null : task._id)
                    }
                  />
                  {activeMenu === task._id && (
                    <div className="menu-dropdown">
                      <p onClick={() => handleUpdateTask(task._id)}>
                        Update Task
                      </p>
                      <p onClick={() => handleDeleteTask(task._id)}>
                        Delete Task
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-tasks-message">No tasks available.</p>
        )}
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDeleteTask}
        message="Are you sure you want to delete this task?"
      />
      <AddNewTask />
    </>
  );
};

export default AdminTasks;
