import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { normalInstance } from "@/utils/normalInstance";
import { AuthState, RegisterResponse, RegisterUser, AuthError } from "./type";

const initialState: AuthState = {
  user: null,
  loadingRegister: false,
  errorRegister: null,
};

export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterUser,
  { rejectValue: AuthError }
>("auth/registerUser", async (formData, thunkAPI) => {
  try {
    const response = await normalInstance.post("/auth/register", formData);

    return response.data;
  } catch (error) {
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
        authError.global = data.message || "Registration failed";
      }

      return thunkAPI.rejectWithValue(authError);
    }

    return thunkAPI.rejectWithValue({ global: "Registration failed" });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loadingRegister = true;
        state.errorRegister = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loadingRegister = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loadingRegister = false;
        state.errorRegister = action.payload ?? { global: "Registration failed" };
      });
  },
});

export default authSlice.reducer;
