import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "@/utils/axiosInstance";
import { AppNotification, NotificationState } from "./type";

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (
    { page = 1, limit = 20, unreadOnly = false }: { page?: number; limit?: number; unreadOnly?: boolean } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.get(
        `/notifications?page=${page}&limit=${limit}&unreadOnly=${unreadOnly}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/notifications/unread-count");
      return response.data.data.unreadCount;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch unread count"
      );
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/notifications/${id}/read`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark as read"
      );
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch("/notifications/read-all");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark all as read"
      );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/notifications/${id}`);
      return { id, unreadCount: response.data.data.unreadCount };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete notification"
      );
    }
  }
);

export const clearAllNotifications = createAsyncThunk(
  "notifications/clearAllNotifications",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.delete("/notifications/clear-all");
      return;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear notifications"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<AppNotification>) => {
      // Prevent duplicates
      const exists = state.notifications.some((n) => n._id === action.payload._id);
      if (!exists) {
        state.notifications.unshift(action.payload);
        if (!action.payload.isRead) {
          state.unreadCount += 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // fetchNotifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchUnreadCount
    builder.addCase(fetchUnreadCount.fulfilled, (state, action) => {
      state.unreadCount = action.payload;
    });

    // markAsRead
    builder.addCase(markAsRead.fulfilled, (state, action) => {
      const updated = action.payload.notification;
      state.unreadCount = action.payload.unreadCount;
      const index = state.notifications.findIndex((n) => n._id === updated._id);
      if (index !== -1) {
        state.notifications[index] = updated;
      }
    });

    // markAllAsRead
    builder.addCase(markAllAsRead.fulfilled, (state) => {
      state.unreadCount = 0;
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
    });

    // deleteNotification
    builder.addCase(deleteNotification.fulfilled, (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n._id !== action.payload.id
      );
      state.unreadCount = action.payload.unreadCount;
    });

    // clearAllNotifications
    builder.addCase(clearAllNotifications.fulfilled, (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    });
  },
});

export const { addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
