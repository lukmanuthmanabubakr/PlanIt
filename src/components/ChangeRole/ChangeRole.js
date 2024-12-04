import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import "./ChangeRole.css";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  getUsers,
  upgradeUser,
} from "../../redux/features/auth/authSlice";
import {
  EMAIL_RESET,
  sendAutomatedEmail,
} from "../../redux/features/email/emailSlice";

const ChangeRole = ({ _id, email }) => {
  const [userRole, setUserRole] = useState("");
  const dispatch = useDispatch();

  const changeRole = async (e) => {
    e.preventDefault();

    if (!userRole) {
      return toast.error("Please select a role");
    }

    const userData = {
      role: userRole,
      id: _id,
    };

    const emailData = {
      subject: "Account Role Changed - TrackItNow",
      send_to: email,
      reply_to: "noreply@trackitnow",
      template: "changeRole",
      url: "/login",
    };

    await dispatch(upgradeUser(userData));
    await dispatch(sendAutomatedEmail(emailData));
    await dispatch(getUsers());
    dispatch(EMAIL_RESET());

    toast.success("Role updated successfully!");
  };

  return (
    <div className="change-role-container">
      <form onSubmit={changeRole}>
        <h3 className="modal-header-text">Change User Role</h3>
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
        >
          <option value="">-- Select Role --</option>
          <option value="subscriber">Subscriber</option>
          <option value="author">Author</option>
          <option value="admin">Admin</option>
          <option value="suspended">Suspended</option>
        </select>
        <div className="modal-buttons">
          <button type="submit" className="submit-btn">
            <FaCheck /> Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangeRole;
