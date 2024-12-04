import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getTaskById,
  deleteTask,
  resetState,
} from "../../../redux/features/task/taskSlice";
import { toast } from "react-toastify";
import { IoEllipsisVertical } from "react-icons/io5"; // Menu icon
import ConfirmationModal from "../../../components/ConfirmationModal/ConfirmationModal";

import "./TaskDetails.css";
import AddSubtask from "../AddSubtask/AddSubtask";

const TaskDetails = () => {
  const { id: taskId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { task, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.tasks
  );

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (taskId) {
      dispatch(getTaskById(taskId));
    }

    return () => {
      dispatch(resetState());
    };
  }, [dispatch, taskId]);

  useEffect(() => {
    if (isError) toast.error(message);
    if (isSuccess && message) toast.success(message);
  }, [isError, isSuccess, message]);

  const handleDeleteTask = () => {
    dispatch(deleteTask(taskId));
    setModalOpen(false);
    navigate("/admin-tasks"); // Redirect to AdminTasks after deletion
  };

  const handleUpdateTask = () => {
    navigate(`/update-task/${taskId}`); // Redirect to update task page
  };

  return (
    <div className="task-details">
      {isLoading ? (
        <p className="loading-message">Loading task...</p>
      ) : isSuccess && task ? (
        <div className={`task-card status-${task.status.toLowerCase()}`}>
          <div style={{ position: "relative" }}>
            <h2 className="task-title">{task.title}</h2>
            <IoEllipsisVertical
              className="menu-icon"
              onClick={() => setMenuOpen(!isMenuOpen)}
            />
            {isMenuOpen && (
              <div className="menu-dropdown">
                <p onClick={handleUpdateTask}>Update Task</p>
                <p onClick={() => setModalOpen(true)}>Delete Task</p>
              </div>
            )}
          </div>
          <p className="task-desc">{task.description}</p>
          <p>
            <strong>Due Date:</strong>{" "}
            {new Date(task.dueDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {task.status}
          </p>
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(task.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(task.updatedAt).toLocaleString()}
          </p>
          {task.tags?.length > 0 && (
            <p>
              <strong>Tags:</strong> {task.tags.join(", ")}
            </p>
          )}

          {/* Subtasks Section */}
          <h3>Subtasks</h3>
          {task.subtasks && task.subtasks.length > 0 ? (
            <ul>
              {task.subtasks.map((subtask) => (
                <li key={subtask._id}>
                  {subtask.title} - {subtask.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>No subtasks available.</p>
          )}
          {/* <AddSubtask taskId={task._id} /> */}
          <AddSubtask taskId={taskId} subtasks={task.subtasks} />
        </div>
      ) : (
        <p className="error-message">Task not found.</p>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleDeleteTask}
        message="Are you sure you want to delete this task?"
      />
    </div>
  );
};

export default TaskDetails;
