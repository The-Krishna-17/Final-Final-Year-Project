import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  AdminState,
  OverviewStats,
  AdminUser,
  Pagination,
  SkillsTaxonomy,
  AdminSwap,
  AdminReview,
  AdminMeeting,
  AdminContactMessage,
} from "./adminType";
import axios from "axios";

const initialState: AdminState = {
  overview: null,
  loadingOverview: false,

  users: [],
  pagination: null,
  loadingUsers: false,

  taxonomy: null,
  loadingTaxonomy: false,

  swaps: [],
  loadingSwaps: false,

  reviews: [],
  loadingReviews: false,

  meetings: [],
  loadingMeetings: false,

  contacts: [],
  loadingContacts: false,

  actionLoading: false,
  error: null,
};

const extractError = (error: unknown, defaultMsg: string): string => {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return defaultMsg;
};

// ─── THUNKS ──────────────────────────────────────────────────────────────────

export const fetchOverviewStats = createAsyncThunk<
  OverviewStats,
  void,
  { rejectValue: string }
>("admin/fetchOverview", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/admin/overview");
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(extractError(err, "Failed to fetch overview analytics"));
  }
});

export const fetchAdminUsers = createAsyncThunk<
  { users: AdminUser[]; pagination: Pagination },
  { page?: number; limit?: number; search?: string; role?: string; isLocked?: string },
  { rejectValue: string }
>("admin/fetchUsers", async (params, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/admin/users", { params });
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(extractError(err, "Failed to fetch user list"));
  }
});

export const updateAdminUserRole = createAsyncThunk<
  AdminUser,
  { userId: string; role: "user" | "admin" | "moderator" },
  { rejectValue: string }
>("admin/updateRole", async ({ userId, role }, thunkAPI) => {
  try {
    const res = await axiosInstance.patch(`/admin/users/${userId}/role`, { role });
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(extractError(err, "Failed to update user role"));
  }
});

export const toggleAdminUserLock = createAsyncThunk<
  { user: AdminUser; lock: boolean },
  { userId: string; lock: boolean },
  { rejectValue: string }
>("admin/toggleLock", async ({ userId, lock }, thunkAPI) => {
  try {
    const res = await axiosInstance.patch(`/admin/users/${userId}/lock`, { lock });
    return { user: res.data.data, lock };
  } catch (err) {
    return thunkAPI.rejectWithValue(extractError(err, "Failed to toggle account lock"));
  }
});


export const deleteAdminUser = createAsyncThunk<
  string,
  { userId: string; reason: string },
  { rejectValue: string }
>("admin/deleteUser", async ({ userId, reason }, thunkAPI) => {
  try {
    await axiosInstance.delete(`/admin/users/${userId}`, { data: { reason } });
    return userId;
  } catch (err) {
    return thunkAPI.rejectWithValue(extractError(err, "Failed to delete user"));
  }
});

export const fetchSkillsTaxonomy = createAsyncThunk<
  SkillsTaxonomy,
  void,
  { rejectValue: string }
>("admin/fetchTaxonomy", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/admin/skills");
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(extractError(err, "Failed to fetch skills taxonomy"));
  }
});

export const overrideSkillAIClassification = createAsyncThunk<
  void,
  { profileId: string; skillId: string; primarySkill?: string; domain?: string; category?: string },
  { rejectValue: string }
>("admin/overrideSkill", async (payload, thunkAPI) => {
  try {
    await axiosInstance.patch("/admin/skills/override", payload);
    thunkAPI.dispatch(fetchSkillsTaxonomy());
  } catch (err) {
    return thunkAPI.rejectWithValue(extractError(err, "Failed to override skill AI classification"));
  }
});

export const fetchAdminSwaps = createAsyncThunk<
  AdminSwap[],
  { status?: string; search?: string } | void,
  { rejectValue: string }
>("admin/fetchSwaps", async (params, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/admin/swaps", { params: params || {} });
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(extractError(err, "Failed to fetch skill swaps"));
  }
});

export const updateAdminSwapStatus = createAsyncThunk<
  AdminSwap,
  { swapId: string; status: string },
  { rejectValue: string }
>("admin/updateSwapStatus", async ({ swapId, status }, thunkAPI) => {
  try {
    const res = await axiosInstance.patch(`/admin/swaps/${swapId}/status`, { status });
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(extractError(err, "Failed to update swap status"));
  }
});

export const fetchAdminReviews = createAsyncThunk<
  AdminReview[],
  void,
  { rejectValue: string }
>("admin/fetchReviews", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/admin/reviews");
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(extractError(err, "Failed to fetch reviews"));
  }
});

export const deleteAdminReview = createAsyncThunk<
  string,
  { reviewId: string; reason: string },
  { rejectValue: string }
>("admin/deleteReview", async ({ reviewId, reason }, thunkAPI) => {
  try {
    await axiosInstance.delete(`/admin/reviews/${reviewId}`, { data: { reason } });
    return reviewId;
  } catch (err) {
    return thunkAPI.rejectWithValue(extractError(err, "Failed to delete review"));
  }
});

export const fetchAdminMeetings = createAsyncThunk<
  AdminMeeting[],
  void,
  { rejectValue: string }
>("admin/fetchMeetings", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/admin/meetings");
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(extractError(err, "Failed to fetch meetings"));
  }
});

export const fetchAdminContacts = createAsyncThunk<
  AdminContactMessage[],
  { status?: string; search?: string } | void,
  { rejectValue: string }
>("admin/fetchContacts", async (params, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/admin/contacts", { params: params || {} });
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(extractError(err, "Failed to fetch contact messages"));
  }
});

export const updateAdminContactStatus = createAsyncThunk<
  AdminContactMessage,
  { messageId: string; status: "unread" | "read" | "replied" },
  { rejectValue: string }
>("admin/updateContactStatus", async ({ messageId, status }, thunkAPI) => {
  try {
    const res = await axiosInstance.patch(`/admin/contacts/${messageId}/status`, { status });
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(extractError(err, "Failed to update contact message status"));
  }
});

export const deleteAdminContact = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("admin/deleteContact", async (messageId, thunkAPI) => {
  try {
    await axiosInstance.delete(`/admin/contacts/${messageId}`);
    return messageId;
  } catch (err) {
    return thunkAPI.rejectWithValue(extractError(err, "Failed to delete contact message"));
  }
});

// ─── SLICE ───────────────────────────────────────────────────────────────────

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchOverviewStats
      .addCase(fetchOverviewStats.pending, (state) => {
        state.loadingOverview = true;
        state.error = null;
      })
      .addCase(fetchOverviewStats.fulfilled, (state, action) => {
        state.loadingOverview = false;
        state.overview = action.payload;
      })
      .addCase(fetchOverviewStats.rejected, (state, action) => {
        state.loadingOverview = false;
        state.error = action.payload as string;
      })

      // fetchAdminUsers
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loadingUsers = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.users = action.payload?.users || (Array.isArray(action.payload) ? action.payload : []);
        state.pagination = action.payload?.pagination || null;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.error = action.payload as string;
      })

      // User mutations (Role, Lock, Verify, Delete)
      .addCase(updateAdminUserRole.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload?._id);
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(toggleAdminUserLock.fulfilled, (state, action) => {
        const { user: updatedUser, lock } = action.payload;
        const idx = state.users.findIndex((u) => u._id === updatedUser?._id);
        if (idx !== -1) {
          state.users[idx] = {
            ...state.users[idx],
            ...updatedUser,
            // Guarantee the lockUntil value matches the intent
            lockUntil: lock
              ? (updatedUser.lockUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())
              : null,
          };
        }
      })

      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })

      // fetchSkillsTaxonomy
      .addCase(fetchSkillsTaxonomy.pending, (state) => {
        state.loadingTaxonomy = true;
        state.error = null;
      })
      .addCase(fetchSkillsTaxonomy.fulfilled, (state, action) => {
        state.loadingTaxonomy = false;
        state.taxonomy = {
          domainCounts: action.payload?.domainCounts || {},
          lowConfidenceQueue: action.payload?.lowConfidenceQueue || [],
        };
      })
      .addCase(fetchSkillsTaxonomy.rejected, (state, action) => {
        state.loadingTaxonomy = false;
        state.error = action.payload as string;
      })

      // fetchAdminSwaps
      .addCase(fetchAdminSwaps.pending, (state) => {
        state.loadingSwaps = true;
        state.error = null;
      })
      .addCase(fetchAdminSwaps.fulfilled, (state, action) => {
        state.loadingSwaps = false;
        const raw = action.payload;
        state.swaps = Array.isArray(raw) ? raw : (raw as any)?.swaps || (raw as any)?.data || [];
      })
      .addCase(fetchAdminSwaps.rejected, (state, action) => {
        state.loadingSwaps = false;
        state.error = action.payload as string;
      })
      .addCase(updateAdminSwapStatus.fulfilled, (state, action) => {
        const idx = state.swaps.findIndex((s) => s._id === action.payload?._id);
        if (idx !== -1) state.swaps[idx] = action.payload;
      })

      // fetchAdminReviews
      .addCase(fetchAdminReviews.pending, (state) => {
        state.loadingReviews = true;
        state.error = null;
      })
      .addCase(fetchAdminReviews.fulfilled, (state, action) => {
        state.loadingReviews = false;
        const raw = action.payload;
        state.reviews = Array.isArray(raw) ? raw : (raw as any)?.reviews || (raw as any)?.data || [];
      })
      .addCase(fetchAdminReviews.rejected, (state, action) => {
        state.loadingReviews = false;
        state.error = action.payload as string;
      })
      .addCase(deleteAdminReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
      })

      // fetchAdminMeetings
      .addCase(fetchAdminMeetings.pending, (state) => {
        state.loadingMeetings = true;
        state.error = null;
      })
      .addCase(fetchAdminMeetings.fulfilled, (state, action) => {
        state.loadingMeetings = false;
        const raw = action.payload;
        state.meetings = Array.isArray(raw) ? raw : (raw as any)?.meetings || (raw as any)?.data || [];
      })
      .addCase(fetchAdminMeetings.rejected, (state, action) => {
        state.loadingMeetings = false;
        state.error = action.payload as string;
      })

      // fetchAdminContacts
      .addCase(fetchAdminContacts.pending, (state) => {
        state.loadingContacts = true;
        state.error = null;
      })
      .addCase(fetchAdminContacts.fulfilled, (state, action) => {
        state.loadingContacts = false;
        const raw = action.payload;
        state.contacts = Array.isArray(raw) ? raw : (raw as any)?.messages || (raw as any)?.data || [];
      })
      .addCase(fetchAdminContacts.rejected, (state, action) => {
        state.loadingContacts = false;
        state.error = action.payload as string;
      })
      .addCase(updateAdminContactStatus.fulfilled, (state, action) => {
        const idx = state.contacts.findIndex((c) => c._id === action.payload?._id);
        if (idx !== -1) state.contacts[idx] = action.payload;
      })
      .addCase(deleteAdminContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter((c) => c._id !== action.payload);
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
