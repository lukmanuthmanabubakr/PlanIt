import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CreateTask.css";
import { toast } from "react-toastify";
import { createTask } from "../../../redux/features/task/taskSlice";
import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser";
import ButtonLoader from "../../../components/ButtonLoader/ButtonLoader";
import { useNavigate } from "react-router-dom";
import Notification from "../../../components/Notification/Notification";

const CreateTask = () => {
  const [title, setTitle] = useState("");
  const { user } = useSelector(
    (state) => state.auth
  );
  const initialState = {
    isVerified: user?.isVerified ?? null, 
  };

  const [profile, setProfile] = useState(initialState);
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading } = useSelector((state) => state.tasks);
  useRedirectLoggedOutUser("/login");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !dueDate) {
      return toast.error("All fields are required");
    }

    const taskData = { title, description, dueDate };

    try {
      await dispatch(createTask(taskData)).unwrap(); // Unwrap to handle rejections
      toast.success("Task created successfully");
      setTitle("");
      setDescription("");
      setDueDate("");
      navigate("/admin-tasks");
    } catch (error) {
      // Capture specific error messages
      const errorMessage = error?.message || "Failed to create task";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      {!isLoading && profile.isVerified === false && <Notification />}
      <div className="task-page">
        <h1>Create a New Task</h1>
        <form onSubmit={handleSubmit} className="task-form">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <ButtonLoader isLoading={isLoading} type="submit">
            Create Task
          </ButtonLoader>
        </form>
      </div>
    </>
  );
};

export default CreateTask;
