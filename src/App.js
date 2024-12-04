import React, { useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import "./index.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Auth/Login/Login";
import SignUp from "./Pages/Auth/SignUp/SignUp";
import ForgotPassword from "./Pages/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "./Pages/Auth/ResetPassword/ResetPassword";
import LoginWithCode from "./Pages/Auth/LoginWithCode/LoginWithCode";
import Verify from "./Pages/Auth/Verify/Verify";
import Profile from "./Pages/Profile/Profile";
import Loader from "./components/Loader/Loader";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoginStatus,
  getUser,
  selectIsLoggedIn,
  selectUser,
} from "./redux/features/auth/authSlice";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CreateTask from "./Pages/Task/CreateTask/CreateTask";
import AdminTasks from "./Pages/Task/AdminTasks/AdminTasks";
import TaskDetails from "./Pages/Task/TaskDetails/TaskDetails";
import UpdateTask from "./Pages/Task/UpdateTask/UpdateTask";
import AddSubtask from "./Pages/Task/AddSubtask/AddSubtask";

axios.defaults.withCredentials = true;

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(getLoginStatus());
    if (isLoggedIn && user === null) {
      dispatch(getUser());
    }
  }, [dispatch, isLoggedIn, user]);
  return (
    <div className="App">
      <Navbar />
      <ToastContainer />
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/task" element={<CreateTask />} />
          <Route path="/admin-tasks" element={<AdminTasks />} />
          <Route path="/get-task/:id" element={<TaskDetails />} />
          <Route path="/update-task/:id" element={<UpdateTask />} />
          <Route path="/sub-task/:id" element={<AddSubtask />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/resetPassword/:resetToken"
            element={<ResetPassword />}
          />
          <Route path="/loginWithCode/:email" element={<LoginWithCode />} />
          <Route path="/verify/:verificationToken" element={<Verify />} />
          <Route path="/user-profile" element={<Profile />} />
        </Routes>
      </GoogleOAuthProvider>
      {/* <Loader /> */}
    </div>
  );
};

export default App;
