import React, { useEffect, useState } from "react";
import "./Login.css";
import LoginSvg from "../../../Assets/undraw_personal_notebook_re_d7dc.svg";
import { NavLink, useNavigate } from "react-router-dom";
import PasswordInput from "../../../components/PasswordInput/PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { validateEmail } from "../../../redux/features/auth/authService";
import {
  login,
  loginWithGoogle,
  RESET,
  sendLoginCode,
} from "../../../redux/features/auth/authSlice";
import Loader from "../../../components/Loader/Loader";
import { GoogleLogin } from "@react-oauth/google";
import ButtonLoader from "../../../components/ButtonLoader/ButtonLoader";

const initialState = {
  email: "",
  password: "",
};

const Login = () => {
  const [formData, setFormData] = useState(initialState);

  const { email, password } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isLoggedIn, isSuccess, message, isError, twoFactor } =
    useSelector((state) => state.auth);

  const loginUser = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("All fields are required");
    }

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }

    const userData = {
      email,
      password,
    };

    // console.log(userData);
    await dispatch(login(userData));
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/admin-tasks");
    }

    if (isError && twoFactor) {
      dispatch(sendLoginCode(email));
      navigate(`/loginWithCode/${email}`);
    }

    dispatch(RESET());
  }, [isLoggedIn, isSuccess, dispatch, navigate, isError, twoFactor, email]);

  const googleLogin = async (credentialResponse) => {
    console.log(credentialResponse);
    await dispatch(
      loginWithGoogle({ userToken: credentialResponse.credential })
    );
  };
  return (
    <>
      <div className="loginAspect">
        <div className="loginContainer">
          <h2>Login</h2>
          <form onSubmit={loginUser}>
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={handleInputChange}
              className="emailInput"
            />
            <PasswordInput
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleInputChange}
            />
            {/* <input
            type="password"
            placeholder="Password"
            required
            name="password"
            value={password}
            onChange={handleInputChange}
          /> */}
            <ButtonLoader
              isLoading={isLoading}
              className="submit"
              type="submit"
            >
              Login
            </ButtonLoader>
          </form>
          <NavLink to="/forgot-password" className="forgotPassword">
            Forgot Password
          </NavLink>
          <div className="UserDontHaveAccount">
            <p>Don't have an account ?</p>
            <NavLink to="/register">Register</NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
