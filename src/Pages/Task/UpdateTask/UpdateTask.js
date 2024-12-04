import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTaskById,
  updateTask,
  resetState,
} from "../../../redux/features/task/taskSlice";
import { toast } from "react-toastify";
import "./UpdateTask.css";

const UpdateTask = () => {
  const { id: taskId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { task, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.tasks
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  useEffect(() => {
    if (taskId) {
      dispatch(getTaskById(taskId));
    }

    return () => {
      dispatch(resetState());
    };
  }, [dispatch, taskId]);

  useEffect(() => {
    if (isError) {
      toast.error(message || "Failed to fetch task.");
    }

    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "pending",
      });
    }
  }, [isError, message, task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.title || !formData.description || !formData.status) {
      toast.error("All fields are required!");
      return;
    }
  
    try {
      await dispatch(updateTask({ id: taskId, taskData: formData })).unwrap();
      toast.success("Task updated successfully!");
  
      // Optionally fetch the updated task again
      await dispatch(getTaskById(taskId));
  
      navigate("/admin-tasks");
    } catch (error) {
      toast.error(error.message || "Failed to update task.");
    }
  };
  

  return (
    <div className="update-task-container">
      {isLoading ? (
        <p className="loading-message">Loading task...</p>
      ) : (
        <form className="update-task-form" onSubmit={handleSubmit}>
          <h1 className="update-task-heading">Update Task</h1>
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Task Description</label>
            <textarea
              name="description"
              className="form-textarea"
              rows="4"
              placeholder="Enter task description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="status">Task Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">in-progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">
              Update Task
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/admin-tasks")}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateTask;
