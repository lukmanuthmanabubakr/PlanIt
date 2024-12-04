import React from "react";
import { FaPlus } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./AddNewTask.css"; // Import the CSS file

const AddNewTask = () => {
  return (
    <div>
      <NavLink to="/task" className="add-task-button">
        <FaPlus />
      </NavLink>
    </div>
  );
};

export default AddNewTask;
