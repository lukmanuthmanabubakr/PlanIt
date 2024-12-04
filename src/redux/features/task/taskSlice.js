import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get the base URL from the environment variables
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const TASK_URL = `${BACKEND_URL}/api/tasks`;

// Create Task
export const createTask = createAsyncThunk(
  "tasks/createTask",
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${TASK_URL}/create-task`, taskData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Ensures cookies are sent for auth
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
//get All task
export const getAllTasksAdmin = createAsyncThunk(
  "tasks/getAllTasksAdmin",
  async (queryParams, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const response = await axios.get(
        `${TASK_URL}/get-all-task?${queryString}`,
        {
          withCredentials: true, // Ensure cookies are sent for authentication
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch tasks");
    }
  }
);
//Get A task
export const getTaskById = createAsyncThunk(
  "tasks/getTaskById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${TASK_URL}/get-task/${id}`, {
        withCredentials: true, // Include authentication credentials
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch task"
      );
    }
  }
);

// Update Task
export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${TASK_URL}/update-task/${id}`,
        taskData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Ensures cookies are sent for auth
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update task"
      );
    }
  }
);

//Delete Task
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${TASK_URL}/delete-task/${id}`, {
        withCredentials: true,
      });
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete task"
      );
    }
  }
);

// Add Subtask
export const addSubtask = createAsyncThunk(
  "tasks/addSubtask",
  async ({ taskId, subtaskData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${TASK_URL}/subtasks/${taskId}`,
        subtaskData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add subtask"
      );
    }
  }
);

//Del Subtask
export const deleteSubtask = createAsyncThunk(
  "tasks/deleteSubtask",
  async ({ taskId, subtaskId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${TASK_URL}/subtasks/${taskId}/${subtaskId}`,
        {
          withCredentials: true,
        }
      );
      return { taskId, subtaskId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete subtask"
      );
    }
  }
);

//Update Subtask
export const updateSubtaskStatus = createAsyncThunk(
  "tasks/updateSubtaskStatus",
  async ({ taskId, subtaskId, status }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${TASK_URL}/${taskId}/subtasks/${subtaskId}`,
        { status }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// Define the initial state
const initialState = {
  tasks: [],
  task: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Create the slice
const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      state.task = null; // Reset task
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle createTask
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks.push(action.payload);
        state.message = "Task created successfully!";
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to create task";
      })
      // NEW cases for getAllTasksAdmin
      .addCase(getAllTasksAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getAllTasksAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload; // Update tasks array
        // state.message = "Tasks fetched successfully!";
      })
      .addCase(getAllTasksAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload?.message || "Failed to fetch tasks";
      })

      // Fetch single task by ID
      .addCase(getTaskById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.task = action.payload;
        // state.message = "Task fetched successfully!";
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to fetch task";
      })

      // Handle updateTask
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.task = action.payload;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = state.tasks.filter(
          (task) => task._id !== action.payload.id
        );
        state.message = action.payload.message;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // Add Subtask
      .addCase(addSubtask.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(addSubtask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Find the parent task and add the new subtask to its subtasks array
        const taskIndex = state.tasks.findIndex(
          (task) => task._id === action.payload.task._id
        );
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = action.payload.task;
        }
        state.message = "Subtask added successfully!";
      })
      .addCase(addSubtask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //Delete subtask
      .addCase(deleteSubtask.fulfilled, (state, action) => {
        const { taskId, subtaskId } = action.payload;
        const taskIndex = state.tasks.findIndex((task) => task._id === taskId);
        if (taskIndex !== -1) {
          const subtaskIndex = state.tasks[taskIndex].subtasks.findIndex(
            (subtask) => subtask._id === subtaskId
          );
          if (subtaskIndex !== -1) {
            state.tasks[taskIndex].subtasks.splice(subtaskIndex, 1);
          }
        }
        state.message = "Subtask deleted successfully!";
      })

      // Handle updating subtask status
      .addCase(updateSubtaskStatus.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(updateSubtaskStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const { taskId, subtaskId, status } = action.payload;

        // Find the task and subtask to update
        const task = state.tasks.find((task) => task._id === taskId);
        if (task) {
          const subtask = task.subtasks.find((sub) => sub._id === subtaskId);
          if (subtask) {
            subtask.status = status;
          }
        }
      })
      .addCase(updateSubtaskStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetState } = taskSlice.actions;
export default taskSlice.reducer;
