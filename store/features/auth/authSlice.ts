import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { normalInstance } from "@/utils/normalInstance";
import {
  AuthState,
  AuthResponse,
  GenericResponse,
  RegisterUser,
  LoginPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  AuthError,
} from "./type";

const initialState: AuthState = {
  user: null,

  loadingRegister: false,
  errorRegister: null,

  loadingLogin: false,
  errorLogin: null,

  loadingMe: false,
  errorMe: null,

  loadingForgotPassword: false,
  errorForgotPassword: null,
  successForgotPassword: null,

  loadingResetPassword: false,
  errorResetPassword: null,
  successResetPassword: null,

  loadingVerifyEmail: false,
  errorVerifyEmail: null,
  successVerifyEmail: null,

  loadingLogout: false,
};

// Helper function to extract AuthError from Axios error
const extractError = (error: unknown, defaultMessage: string): AuthError => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data as { message?: string; errors?: { field: string; message: string }[] };
    const authError: AuthError = {};
    
    if (data.errors && data.errors.length > 0) {
      authError.fields = {};
      data.errors.forEach(err => {
        const fieldName = err.field.includes(".") ? err.field.split(".").pop() || err.field : err.field;
        authError.fields![fieldName] = err.message;
      });
    }
    
    if (data.message && data.message !== "Validation failed") {
      authError.global = data.message;
    }

    if (!authError.fields && !authError.global) {
      authError.global = data.message || defaultMessage;
    }

    return authError;
  }
  return { global: defaultMessage };
};

// Thunks
export const registerUser = createAsyncThunk<AuthResponse, RegisterUser, { rejectValue: AuthError }>(
  "auth/registerUser",
  async (formData, thunkAPI) => {
    try {
      const response = await normalInstance.post("/auth/register", formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Registration failed"));
    }
  }
);

export const loginUser = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: AuthError }>(
  "auth/loginUser",
  async (formData, thunkAPI) => {
    try {
      const response = await normalInstance.post("/auth/login", formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Login failed"));
    }
  }
);

export const getMe = createAsyncThunk<AuthResponse, void, { rejectValue: AuthError }>(
  "auth/getMe",
  async (_, thunkAPI) => {
    try {
      const response = await normalInstance.get("/auth/me");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Failed to fetch user data"));
    }
  }
);

export const forgotPassword = createAsyncThunk<GenericResponse, ForgotPasswordPayload, { rejectValue: AuthError }>(
  "auth/forgotPassword",
  async (formData, thunkAPI) => {
    try {
      const response = await normalInstance.post("/auth/forgot-password", formData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Failed to send reset email"));
    }
  }
);

export const resetPassword = createAsyncThunk<GenericResponse, ResetPasswordPayload, { rejectValue: AuthError }>(
  "auth/resetPassword",
  async ({ token, password, confirmPassword }, thunkAPI) => {
    try {
      const response = await normalInstance.post(`/auth/reset-password/${token}`, { password, confirmPassword });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Failed to reset password"));
    }
  }
);

export const verifyEmail = createAsyncThunk<GenericResponse, string, { rejectValue: AuthError }>(
  "auth/verifyEmail",
  async (token, thunkAPI) => {
    try {
      const response = await normalInstance.get(`/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Email verification failed"));
    }
  }
);

export const logoutUser = createAsyncThunk<GenericResponse, void, { rejectValue: AuthError }>(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    try {
      const response = await normalInstance.post("/auth/logout");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Logout failed"));
    }
  }
);

export const logoutAll = createAsyncThunk<GenericResponse, void, { rejectValue: AuthError }>(
  "auth/logoutAll",
  async (_, thunkAPI) => {
    try {
      const response = await normalInstance.post("/auth/logout-all");
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(extractError(error, "Logout from all devices failed"));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.errorRegister = null;
      state.errorLogin = null;
      state.errorMe = null;
      state.errorForgotPassword = null;
      state.errorResetPassword = null;
      state.errorVerifyEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loadingRegister = true;
        state.errorRegister = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loadingRegister = false;
        state.user = action.payload.data.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loadingRegister = false;
        state.errorRegister = action.payload ?? { global: "Registration failed" };
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loadingLogin = true;
        state.errorLogin = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loadingLogin = false;
        state.user = action.payload.data.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loadingLogin = false;
        state.errorLogin = action.payload ?? { global: "Login failed" };
      })

      // GET ME
      .addCase(getMe.pending, (state) => {
        state.loadingMe = true;
        state.errorMe = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loadingMe = false;
        state.user = action.payload.data.user;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loadingMe = false;
        state.user = null;
        state.errorMe = action.payload ?? { global: "Failed to fetch user data" };
      })

      // FORGOT PASSWORD
      .addCase(forgotPassword.pending, (state) => {
        state.loadingForgotPassword = true;
        state.errorForgotPassword = null;
        state.successForgotPassword = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loadingForgotPassword = false;
        state.successForgotPassword = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loadingForgotPassword = false;
        state.errorForgotPassword = action.payload ?? { global: "Failed to send reset email" };
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.loadingResetPassword = true;
        state.errorResetPassword = null;
        state.successResetPassword = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loadingResetPassword = false;
        state.successResetPassword = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loadingResetPassword = false;
        state.errorResetPassword = action.payload ?? { global: "Failed to reset password" };
      })

      // VERIFY EMAIL
      .addCase(verifyEmail.pending, (state) => {
        state.loadingVerifyEmail = true;
        state.errorVerifyEmail = null;
        state.successVerifyEmail = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loadingVerifyEmail = false;
        state.successVerifyEmail = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loadingVerifyEmail = false;
        state.errorVerifyEmail = action.payload ?? { global: "Email verification failed" };
      })

      // LOGOUT
      .addCase(logoutUser.pending, (state) => {
        state.loadingLogout = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loadingLogout = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loadingLogout = false;
        state.user = null; // Still clear user on client if logout fails
      })

      // LOGOUT ALL
      .addCase(logoutAll.pending, (state) => {
        state.loadingLogout = true;
      })
      .addCase(logoutAll.fulfilled, (state) => {
        state.loadingLogout = false;
        state.user = null;
      })
      .addCase(logoutAll.rejected, (state) => {
        state.loadingLogout = false;
        state.user = null; // Still clear user on client
      });
  },
});

export const { clearErrors } = authSlice.actions;

export default authSlice.reducer;
