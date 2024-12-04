import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/authSlice";
import emailReducer from "../redux/features/email/emailSlice";
import filterReducer from "../redux/features/auth/filterSlice";
import taskReducer from "../redux/features/task/taskSlice";  // Add this import

export const store = configureStore({
  reducer: {
    auth: authReducer,
    email: emailReducer,
    filter: filterReducer,
    tasks: taskReducer,
  },
});