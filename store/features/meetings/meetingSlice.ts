import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  MeetingState,
  MeetingResponse,
  MeetingsResponse,
  CreateMeetingPayload,
  UpdateMeetingPayload,
} from "./type";
import axios from "axios";

const initialState: MeetingState = {
  meetings: [],
  currentMeeting: null,
  loadingMeetings: false,
  loadingCurrent: false,
  loadingAction: false,
  errorMeetings: null,
  errorCurrent: null,
  errorAction: null,
};

const extractError = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return defaultMessage;
};

export const fetchMeetings = createAsyncThunk<
  MeetingsResponse,
  void,
  { rejectValue: string }
>("meetings/fetchAll", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/meetings");
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to fetch meetings"));
  }
});

export const fetchMeetingById = createAsyncThunk<
  MeetingResponse,
  string,
  { rejectValue: string }
>("meetings/fetchById", async (roomId, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/meetings/${roomId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to fetch meeting details"));
  }
});

export const createMeeting = createAsyncThunk<
  MeetingResponse,
  CreateMeetingPayload,
  { rejectValue: string }
>("meetings/create", async (payload, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/meetings", payload);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to create meeting"));
  }
});

export const updateMeeting = createAsyncThunk<
  MeetingResponse,
  UpdateMeetingPayload,
  { rejectValue: string }
>("meetings/update", async (payload, thunkAPI) => {
  try {
    const { roomId, ...data } = payload;
    const response = await axiosInstance.patch(`/meetings/${roomId}`, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to update meeting"));
  }
});

export const deleteMeeting = createAsyncThunk<
  { roomId: string },
  string,
  { rejectValue: string }
>("meetings/delete", async (roomId, thunkAPI) => {
  try {
    await axiosInstance.delete(`/meetings/${roomId}`);
    return { roomId };
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to delete meeting"));
  }
});

export const joinMeetingAction = createAsyncThunk<
  MeetingResponse,
  string,
  { rejectValue: string }
>("meetings/join", async (roomId, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`/meetings/${roomId}/join`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to join meeting"));
  }
});

export const leaveMeetingAction = createAsyncThunk<
  MeetingResponse,
  string,
  { rejectValue: string }
>("meetings/leave", async (roomId, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`/meetings/${roomId}/leave`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to leave meeting"));
  }
});

const meetingSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {
    clearMeetingErrors: (state) => {
      state.errorMeetings = null;
      state.errorCurrent = null;
      state.errorAction = null;
    },
    clearCurrentMeeting: (state) => {
      state.currentMeeting = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder
      .addCase(fetchMeetings.pending, (state) => {
        state.loadingMeetings = true;
        state.errorMeetings = null;
      })
      .addCase(fetchMeetings.fulfilled, (state, action) => {
        state.loadingMeetings = false;
        state.meetings = action.payload.data.meetings;
      })
      .addCase(fetchMeetings.rejected, (state, action) => {
        state.loadingMeetings = false;
        state.errorMeetings = action.payload as string;
      });

    // Fetch by id
    builder
      .addCase(fetchMeetingById.pending, (state) => {
        state.loadingCurrent = true;
        state.errorCurrent = null;
      })
      .addCase(fetchMeetingById.fulfilled, (state, action) => {
        state.loadingCurrent = false;
        state.currentMeeting = action.payload.data.meeting;
      })
      .addCase(fetchMeetingById.rejected, (state, action) => {
        state.loadingCurrent = false;
        state.errorCurrent = action.payload as string;
      });

    // Create
    builder
      .addCase(createMeeting.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.loadingAction = false;
        state.meetings.unshift(action.payload.data.meeting);
      })
      .addCase(createMeeting.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload as string;
      });

    // Update
    builder
      .addCase(updateMeeting.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(updateMeeting.fulfilled, (state, action) => {
        state.loadingAction = false;
        const updated = action.payload.data.meeting;
        const index = state.meetings.findIndex((m) => m._id === updated._id);
        if (index !== -1) {
          state.meetings[index] = updated;
        }
        if (state.currentMeeting?._id === updated._id) {
          state.currentMeeting = updated;
        }
      })
      .addCase(updateMeeting.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload as string;
      });

    // Delete
    builder
      .addCase(deleteMeeting.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(deleteMeeting.fulfilled, (state, action) => {
        state.loadingAction = false;
        state.meetings = state.meetings.filter(
          (m) => m.roomId !== action.payload.roomId
        );
      })
      .addCase(deleteMeeting.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload as string;
      });

    // Join
    builder.addCase(joinMeetingAction.fulfilled, (state, action) => {
      state.currentMeeting = action.payload.data.meeting;
    });

    // Leave
    builder.addCase(leaveMeetingAction.fulfilled, (state, action) => {
      state.currentMeeting = action.payload.data.meeting;
    });
  },
});

export const { clearMeetingErrors, clearCurrentMeeting } = meetingSlice.actions;
export default meetingSlice.reducer;
