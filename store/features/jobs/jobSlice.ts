import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/utils/axiosInstance";
import axios from "axios";
import {
  JobState,
  JobsResponse,
  JobResponse,
  CreateJobPayload,
  UpdateJobPayload,
} from "./type";

const initialState: JobState = {
  jobs: [],
  adminJobs: [],
  currentJob: null,
  loadingJobs: false,
  loadingAdminJobs: false,
  loadingCurrent: false,
  loadingAction: false,
  errorJobs: null,
  errorAdminJobs: null,
  errorCurrent: null,
  errorAction: null,
};

const extractError = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data;
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map((e: any) => e.message).join(", ");
    }
    if (data.message) {
      return data.message;
    }
  }
  return defaultMessage;
};

// User thunks
export const fetchJobs = createAsyncThunk<
  JobsResponse,
  { search?: string; type?: string } | undefined,
  { rejectValue: string }
>("jobs/fetchJobs", async (params, thunkAPI) => {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.type) query.append("type", params.type);

    const response = await axiosInstance.get(`/jobs?${query.toString()}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to fetch jobs"));
  }
});

export const fetchJobById = createAsyncThunk<
  JobResponse,
  string,
  { rejectValue: string }
>("jobs/fetchById", async (id, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to fetch job details"));
  }
});

// Admin thunks
export const fetchAdminJobs = createAsyncThunk<
  JobsResponse,
  void,
  { rejectValue: string }
>("jobs/fetchAdminJobs", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/jobs/admin/all");
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to fetch all jobs for admin"));
  }
});

export const createJobAction = createAsyncThunk<
  JobResponse,
  CreateJobPayload,
  { rejectValue: string }
>("jobs/create", async (payload, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/jobs/admin", payload);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to create job"));
  }
});

export const updateJobAction = createAsyncThunk<
  JobResponse,
  UpdateJobPayload,
  { rejectValue: string }
>("jobs/update", async (payload, thunkAPI) => {
  try {
    const { id, ...data } = payload;
    const response = await axiosInstance.put(`/jobs/admin/${id}`, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to update job"));
  }
});

export const deleteJobAction = createAsyncThunk<
  { id: string },
  { id: string; reason: string },
  { rejectValue: string }
>("jobs/delete", async ({ id, reason }, thunkAPI) => {
  try {
    await axiosInstance.delete(`/jobs/admin/${id}`, { data: { reason } });
    return { id };
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to delete job"));
  }
});

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    clearJobErrors: (state) => {
      state.errorJobs = null;
      state.errorAdminJobs = null;
      state.errorCurrent = null;
      state.errorAction = null;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user jobs
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loadingJobs = true;
        state.errorJobs = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loadingJobs = false;
        state.jobs = action.payload.data.jobs;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loadingJobs = false;
        state.errorJobs = action.payload as string;
      });

    // Fetch single job
    builder
      .addCase(fetchJobById.pending, (state) => {
        state.loadingCurrent = true;
        state.errorCurrent = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loadingCurrent = false;
        state.currentJob = action.payload.data.job;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loadingCurrent = false;
        state.errorCurrent = action.payload as string;
      });

    // Fetch admin jobs
    builder
      .addCase(fetchAdminJobs.pending, (state) => {
        state.loadingAdminJobs = true;
        state.errorAdminJobs = null;
      })
      .addCase(fetchAdminJobs.fulfilled, (state, action) => {
        state.loadingAdminJobs = false;
        state.adminJobs = action.payload.data.jobs;
      })
      .addCase(fetchAdminJobs.rejected, (state, action) => {
        state.loadingAdminJobs = false;
        state.errorAdminJobs = action.payload as string;
      });

    // Create job
    builder
      .addCase(createJobAction.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(createJobAction.fulfilled, (state, action) => {
        state.loadingAction = false;
        const newJob = action.payload.data.job;
        if (newJob.status === "open") {
          state.jobs.unshift(newJob);
        }
        state.adminJobs.unshift(newJob);
      })
      .addCase(createJobAction.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload as string;
      });

    // Update job
    builder
      .addCase(updateJobAction.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(updateJobAction.fulfilled, (state, action) => {
        state.loadingAction = false;
        const updated = action.payload.data.job;
        
        // Update in public list
        const index = state.jobs.findIndex((j) => j._id === updated._id);
        if (updated.status === "open") {
          if (index !== -1) {
            state.jobs[index] = updated;
          } else {
            state.jobs.unshift(updated);
          }
        } else {
          if (index !== -1) {
            state.jobs.splice(index, 1);
          }
        }

        // Update in admin list
        const adminIndex = state.adminJobs.findIndex((j) => j._id === updated._id);
        if (adminIndex !== -1) {
          state.adminJobs[adminIndex] = updated;
        }

        if (state.currentJob?._id === updated._id) {
          state.currentJob = updated;
        }
      })
      .addCase(updateJobAction.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload as string;
      });

    // Delete job
    builder
      .addCase(deleteJobAction.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(deleteJobAction.fulfilled, (state, action) => {
        state.loadingAction = false;
        state.jobs = state.jobs.filter((j) => j._id !== action.payload.id);
        state.adminJobs = state.adminJobs.filter((j) => j._id !== action.payload.id);
        if (state.currentJob?._id === action.payload.id) {
          state.currentJob = null;
        }
      })
      .addCase(deleteJobAction.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload as string;
      });
  },
});

export const { clearJobErrors, clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
