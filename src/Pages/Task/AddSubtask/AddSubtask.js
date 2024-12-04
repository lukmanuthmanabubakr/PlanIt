// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addSubtask, deleteSubtask } from "../../../redux/features/task/taskSlice";
// import { IoEllipsisVertical } from "react-icons/io5";
// import "./AddSubtask.css"

// const AddSubtask = ({ taskId, subtasks }) => {
//   const [title, setTitle] = useState("");
//   const [status, setStatus] = useState("pending");
//   const [openDropdown, setOpenDropdown] = useState(null);

//   const dispatch = useDispatch();
//   const { isLoading, message } = useSelector((state) => state.tasks);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (title.trim() === "") return alert("Title is required!");

//     dispatch(addSubtask({ taskId, subtaskData: { title, status } }));
//     setTitle("");
//   };

//   const handleDeleteSubtask = (subtaskId) => {
//     dispatch(deleteSubtask({ taskId, subtaskId }));
//     setOpenDropdown(null); // Close the dropdown after deletion
//   };

//   return (
//     <div className="add-subtask">
//       <h3>Add Subtask</h3>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Subtask Title"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           required
//         />
//         <select value={status} onChange={(e) => setStatus(e.target.value)}>
//           <option value="pending">Pending</option>
//           <option value="completed">Completed</option>
//         </select>
//         <button type="submit" disabled={isLoading}>
//           {isLoading ? "Adding..." : "Add Subtask"}
//         </button>
//       </form>
//       {message && <p>{message}</p>}

//       <div className="subtask-list">
//         {subtasks?.map((subtask) => (
//           <div key={subtask._id} className="subtask-item">
//             <span>{subtask.title}</span>
//             <IoEllipsisVertical
//               className="subtask-dropdown-icon"
//               onClick={() => setOpenDropdown(openDropdown === subtask._id ? null : subtask._id)}
//             />
//             {openDropdown === subtask._id && (
//               <div className="subtask-dropdown">
//                 <p onClick={() => handleDeleteSubtask(subtask._id)}>Delete Subtask</p>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AddSubtask;




import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoEllipsisVertical } from "react-icons/io5";
import {
  addSubtask,
  deleteSubtask,
  updateSubtaskStatus,
} from "../../../redux/features/task/taskSlice";
import "./AddSubtask.css";

const AddSubtask = ({ taskId, subtasks }) => {
  const [title, setTitle] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  const dispatch = useDispatch();
  const { isLoading, message } = useSelector((state) => state.tasks);

  // Handle adding a subtask
  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }
    dispatch(addSubtask({ taskId, subtaskData: { title, status: "pending" } }));
    setTitle("");
  };

  // Handle deleting a subtask
  const handleDeleteSubtask = (subtaskId) => {
    dispatch(deleteSubtask({ taskId, subtaskId }));
    setActiveDropdown(null);
  };

  // Toggle the subtask status
  const handleToggleSubtaskStatus = (subtask) => {
    const updatedStatus = subtask.status === "pending" ? "completed" : "pending";
    dispatch(updateSubtaskStatus({ taskId, subtaskId: subtask._id, status: updatedStatus }));
  };

  // Toggle dropdown visibility for a specific subtask
  const toggleDropdown = (subtaskId) => {
    setActiveDropdown((prev) => (prev === subtaskId ? null : subtaskId));
  };

  return (
    <div className="add-subtask">
      <h3>Add Subtask</h3>
      <form onSubmit={handleAddSubtask}>
        <input
          type="text"
          placeholder="Subtask Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Subtask"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}

      <div className="subtask-list">
        {subtasks?.map((subtask) => (
          <div
            key={subtask._id}
            className={`subtask-item ${subtask.status === "completed" ? "pending" : ""}`}
          >
            <input
              type="checkbox"
              checked={subtask.status === "completed"}
              onChange={() => handleToggleSubtaskStatus(subtask)}
            />
            <span>{subtask.title}</span>
            <IoEllipsisVertical
              className="subtask-dropdown-icon"
              onClick={() => toggleDropdown(subtask._id)}
            />
            {activeDropdown === subtask._id && (
              <div className="subtask-dropdown">
                <p onClick={() => handleDeleteSubtask(subtask._id)}>Delete Subtask</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddSubtask;

