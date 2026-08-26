import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/utils/axiosInstance";
import axios from "axios";
import {
  BlogState,
  BlogsResponse,
  BlogResponse,
  CreateBlogPayload,
  UpdateBlogPayload,
} from "./type";

const initialState: BlogState = {
  blogs: [],
  myBlogs: [],
  adminBlogs: [],
  currentBlog: null,
  loadingBlogs: false,
  loadingMyBlogs: false,
  loadingAdminBlogs: false,
  loadingCurrent: false,
  loadingAction: false,
  errorBlogs: null,
  errorMyBlogs: null,
  errorAdminBlogs: null,
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

// Async Thunks
export const fetchPublishedBlogs = createAsyncThunk<
  BlogsResponse,
  { search?: string; tag?: string } | undefined,
  { rejectValue: string }
>("blogs/fetchPublished", async (params, thunkAPI) => {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.tag) query.append("tag", params.tag);

    const response = await axiosInstance.get(`/blogs?${query.toString()}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to fetch blogs"));
  }
});

export const fetchMyBlogs = createAsyncThunk<
  BlogsResponse,
  void,
  { rejectValue: string }
>("blogs/fetchMyBlogs", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/blogs/user/me");
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to fetch your blogs"));
  }
});

export const fetchAdminBlogs = createAsyncThunk<
  BlogsResponse,
  { search?: string; status?: string; tag?: string } | undefined,
  { rejectValue: string }
>("blogs/fetchAdmin", async (params, thunkAPI) => {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.status) query.append("status", params.status);
    if (params?.tag) query.append("tag", params.tag);

    const response = await axiosInstance.get(`/blogs/admin/all?${query.toString()}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to fetch all blogs"));
  }
});

export const fetchBlogById = createAsyncThunk<
  BlogResponse,
  string,
  { rejectValue: string }
>("blogs/fetchById", async (id, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to fetch blog details"));
  }
});

export const createBlogAction = createAsyncThunk<
  BlogResponse,
  CreateBlogPayload,
  { rejectValue: string }
>("blogs/create", async (payload, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/blogs", payload);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to create blog"));
  }
});

export const updateBlogAction = createAsyncThunk<
  BlogResponse,
  UpdateBlogPayload,
  { rejectValue: string }
>("blogs/update", async (payload, thunkAPI) => {
  try {
    const { id, ...data } = payload;
    const response = await axiosInstance.put(`/blogs/${id}`, data);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to update blog"));
  }
});

export const deleteBlogAction = createAsyncThunk<
  { id: string },
  { id: string; reason?: string },
  { rejectValue: string }
>("blogs/delete", async ({ id, reason }, thunkAPI) => {
  try {
    await axiosInstance.delete(`/blogs/${id}`, { data: { reason } });
    return { id };
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to delete blog"));
  }
});

export const toggleLikeBlogAction = createAsyncThunk<
  { id: string; likes: string[] },
  string,
  { rejectValue: string }
>("blogs/toggleLike", async (id, thunkAPI) => {
  try {
    const response = await axiosInstance.post(`/blogs/${id}/like`);
    return { id, likes: response.data.data.likes };
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to like/unlike blog"));
  }
});

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearBlogErrors: (state) => {
      state.errorBlogs = null;
      state.errorMyBlogs = null;
      state.errorCurrent = null;
      state.errorAction = null;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch published blogs
    builder
      .addCase(fetchPublishedBlogs.pending, (state) => {
        state.loadingBlogs = true;
        state.errorBlogs = null;
      })
      .addCase(fetchPublishedBlogs.fulfilled, (state, action) => {
        state.loadingBlogs = false;
        state.blogs = action.payload.data.blogs;
      })
      .addCase(fetchPublishedBlogs.rejected, (state, action) => {
        state.loadingBlogs = false;
        state.errorBlogs = action.payload as string;
      });

    // Fetch my blogs
    builder
      .addCase(fetchMyBlogs.pending, (state) => {
        state.loadingMyBlogs = true;
        state.errorMyBlogs = null;
      })
      .addCase(fetchMyBlogs.fulfilled, (state, action) => {
        state.loadingMyBlogs = false;
        state.myBlogs = action.payload.data.blogs;
      })
      .addCase(fetchMyBlogs.rejected, (state, action) => {
        state.loadingMyBlogs = false;
        state.errorMyBlogs = action.payload as string;
      });

    // Fetch admin blogs
    builder
      .addCase(fetchAdminBlogs.pending, (state) => {
        state.loadingAdminBlogs = true;
        state.errorAdminBlogs = null;
      })
      .addCase(fetchAdminBlogs.fulfilled, (state, action) => {
        state.loadingAdminBlogs = false;
        state.adminBlogs = action.payload.data.blogs;
      })
      .addCase(fetchAdminBlogs.rejected, (state, action) => {
        state.loadingAdminBlogs = false;
        state.errorAdminBlogs = action.payload as string;
      });

    // Fetch single blog
    builder
      .addCase(fetchBlogById.pending, (state) => {
        state.loadingCurrent = true;
        state.errorCurrent = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loadingCurrent = false;
        state.currentBlog = action.payload.data.blog;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loadingCurrent = false;
        state.errorCurrent = action.payload as string;
      });

    // Create blog
    builder
      .addCase(createBlogAction.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(createBlogAction.fulfilled, (state, action) => {
        state.loadingAction = false;
        const newBlog = action.payload.data.blog;
        if (newBlog.status === "published") {
          state.blogs.unshift(newBlog);
        }
        state.myBlogs.unshift(newBlog);
        state.adminBlogs.unshift(newBlog);
      })
      .addCase(createBlogAction.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload as string;
      });

    // Update blog
    builder
      .addCase(updateBlogAction.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(updateBlogAction.fulfilled, (state, action) => {
        state.loadingAction = false;
        const updated = action.payload.data.blog;
        
        // Update in blogs list (if published, otherwise remove from blogs list if changed to draft)
        const blogIndex = state.blogs.findIndex((b) => b._id === updated._id);
        if (updated.status === "published") {
          if (blogIndex !== -1) {
            state.blogs[blogIndex] = updated;
          } else {
            state.blogs.unshift(updated);
          }
        } else {
          if (blogIndex !== -1) {
            state.blogs.splice(blogIndex, 1);
          }
        }

        // Update in myBlogs
        const myIndex = state.myBlogs.findIndex((b) => b._id === updated._id);
        if (myIndex !== -1) {
          state.myBlogs[myIndex] = updated;
        }

        if (state.currentBlog?._id === updated._id) {
          state.currentBlog = updated;
        }
      })
      .addCase(updateBlogAction.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload as string;
      });

    // Delete blog
    builder
      .addCase(deleteBlogAction.pending, (state) => {
        state.loadingAction = true;
        state.errorAction = null;
      })
      .addCase(deleteBlogAction.fulfilled, (state, action) => {
        state.loadingAction = false;
        state.blogs = state.blogs.filter((b) => b._id !== action.payload.id);
        state.myBlogs = state.myBlogs.filter((b) => b._id !== action.payload.id);
        state.adminBlogs = state.adminBlogs.filter((b) => b._id !== action.payload.id);
        if (state.currentBlog?._id === action.payload.id) {
          state.currentBlog = null;
        }
      })
      .addCase(deleteBlogAction.rejected, (state, action) => {
        state.loadingAction = false;
        state.errorAction = action.payload as string;
      });

    // Like blog
    builder.addCase(toggleLikeBlogAction.fulfilled, (state, action) => {
      const { id, likes } = action.payload;
      
      const blog = state.blogs.find((b) => b._id === id);
      if (blog) {
        blog.likes = likes;
      }

      const myBlog = state.myBlogs.find((b) => b._id === id);
      if (myBlog) {
        myBlog.likes = likes;
      }

      if (state.currentBlog?._id === id) {
        state.currentBlog.likes = likes;
      }
    });
  },
});

export const { clearBlogErrors, clearCurrentBlog } = blogSlice.actions;
export default blogSlice.reducer;
