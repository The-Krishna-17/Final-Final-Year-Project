import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosInstance } from "@/utils/axiosInstance";
import { AuthResponse, GenericResponse, AuthError } from "../auth/type";
import {
  UpdateProfilePayload,
  UploadAvatarPayload,
  ProfileState,
} from "./type";
import { setUser } from "../auth/authSlice";

// Helper function to extract AuthError from Axios error
const extractError = (error: unknown, defaultMessage: string): AuthError => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data as {
      message?: string;
      errors?: { field: string; message: string }[];
    };
    const authError: AuthError = {};

    if (data.errors && data.errors.length > 0) {
      authError.fields = {};
      data.errors.forEach((err) => {
        const fieldName = err.field.includes(".")
          ? err.field.split(".").pop() || err.field
          : err.field;
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

const initialState: ProfileState = {
  loadingGetProfile: false,
  errorGetProfile: null,

  loadingUpdateProfile: false,
  errorUpdateProfile: null,

  loadingUploadAvatar: false,
  errorUploadAvatar: null,

  loadingDeactivateAccount: false,
  errorDeactivateAccount: null,
};

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const getProfile = createAsyncThunk<
  AuthResponse,
  void,
  { rejectValue: AuthError }
>("profile/getProfile", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/users/profile");
    // Keep auth.user in sync with the full profile data
    thunkAPI.dispatch(setUser(response.data.data.user));
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      extractError(error, "Failed to fetch profile"),
    );
  }
});

export const updateProfile = createAsyncThunk<
  AuthResponse,
  UpdateProfilePayload,
  { rejectValue: AuthError }
>("profile/updateProfile", async (formData, thunkAPI) => {
  try {
    const response = await axiosInstance.put("/users/profile", formData);
    // Keep auth.user in sync after every profile update
    thunkAPI.dispatch(setUser(response.data.data.user));
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      extractError(error, "Failed to update profile"),
    );
  }
});

export const uploadAvatar = createAsyncThunk<
  AuthResponse,
  UploadAvatarPayload,
  { rejectValue: AuthError }
>("profile/uploadAvatar", async (formData, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/users/avatar", formData);
    thunkAPI.dispatch(setUser(response.data.data.user));
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      extractError(error, "Failed to upload avatar"),
    );
  }
});

export const deactivateAccount = createAsyncThunk<
  GenericResponse,
  void,
  { rejectValue: AuthError }
>("profile/deactivateAccount", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/users/deactivate");
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      extractError(error, "Failed to deactivate account"),
    );
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileErrors: (state) => {
      state.errorGetProfile = null;
      state.errorUpdateProfile = null;
      state.errorUploadAvatar = null;
      state.errorDeactivateAccount = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET PROFILE
      .addCase(getProfile.pending, (state) => {
        state.loadingGetProfile = true;
        state.errorGetProfile = null;
      })
      .addCase(getProfile.fulfilled, (state) => {
        state.loadingGetProfile = false;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loadingGetProfile = false;
        state.errorGetProfile = action.payload ?? {
          global: "Failed to fetch profile",
        };
      })

      // UPDATE PROFILE
      .addCase(updateProfile.pending, (state) => {
        state.loadingUpdateProfile = true;
        state.errorUpdateProfile = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loadingUpdateProfile = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loadingUpdateProfile = false;
        state.errorUpdateProfile = action.payload ?? {
          global: "Failed to update profile",
        };
      })

      // UPLOAD AVATAR
      .addCase(uploadAvatar.pending, (state) => {
        state.loadingUploadAvatar = true;
        state.errorUploadAvatar = null;
      })
      .addCase(uploadAvatar.fulfilled, (state) => {
        state.loadingUploadAvatar = false;
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loadingUploadAvatar = false;
        state.errorUploadAvatar = action.payload ?? {
          global: "Failed to upload avatar",
        };
      })

      // DEACTIVATE ACCOUNT
      .addCase(deactivateAccount.pending, (state) => {
        state.loadingDeactivateAccount = true;
        state.errorDeactivateAccount = null;
      })
      .addCase(deactivateAccount.fulfilled, (state) => {
        state.loadingDeactivateAccount = false;
      })
      .addCase(deactivateAccount.rejected, (state, action) => {
        state.loadingDeactivateAccount = false;
        state.errorDeactivateAccount = action.payload ?? {
          global: "Failed to deactivate account",
        };
      });
  },
});

export const { clearProfileErrors } = profileSlice.actions;

export default profileSlice.reducer;

