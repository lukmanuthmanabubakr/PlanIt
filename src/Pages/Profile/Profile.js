import React, { useState } from "react";
import { FaUser, FaUsers } from "react-icons/fa";
import { GoLock } from "react-icons/go";
import { BiLogOut } from "react-icons/bi";
import UserProfile from "./UserProfile/UserProfile";
import ChangePassword from "./ChangePassword/ChangePassword";
import UserStats from "../../components/UserStats/UserStats.js";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser.js";
import { logout, RESET } from "../../redux/features/auth/authSlice.js";
import { AdminAuthorLink } from "../../components/protect/hiddenLink.js";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useRedirectLoggedOutUser("/login");
  const [activeContent, setActiveContent] = useState("user");

  const handleContentChange = (content) => {
    setActiveContent(content);
  };

  const logoutUser = async () => {
    try {
      await dispatch(logout()).unwrap(); // Make sure logout resolves
      dispatch(RESET()); // Reset Redux state
      navigate("/login"); // Redirect after logout is complete
    } catch (error) {
      console.error("Logout failed: ", error); // Handle error if needed
    }
  };

  return (
    <div className="profileContainer">
      <div className="profileContent">
        {activeContent === "user" && <UserProfile />}
        {activeContent === "security" && <ChangePassword />}
        {activeContent === "team" && <UserStats />}
      </div>

      <div className="bottomBar">
        <div
          className="bottomBarItem"
          onClick={() => handleContentChange("user")}
        >
          <FaUser  size={25}/>
          <p>Profile</p>
        </div>
        <div
          className="bottomBarItem"
          onClick={() => handleContentChange("security")}
        >
          <GoLock size={25}/>
          <p>Security</p>
        </div>
        <AdminAuthorLink>
          <div
            className="bottomBarItem"
            onClick={() => handleContentChange("team")}
          >
            <FaUsers size={25}/>
            <p>Users</p>
          </div>
        </AdminAuthorLink>
        <div className="bottomBarItem" onClick={logoutUser}>
          <BiLogOut size={25}/>
          <p>Logout</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
