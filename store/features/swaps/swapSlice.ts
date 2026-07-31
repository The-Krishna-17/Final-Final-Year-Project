import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/utils/axiosInstance";
import { SwapState, SkillSwap, SwapPartner, RequestSwapPayload } from "./type";
import axios from "axios";

const initialState: SwapState = {
  swaps: [],
  swapPartners: [],
  loadingSwaps: false,
  loadingPartners: false,
  loadingAction: false,
  error: null,
};

const extractError = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return defaultMessage;
};

// ─── THUNKS ──────────────────────────────────────────────────────────────────

export const fetchMySwaps = createAsyncThunk<
  SkillSwap[],
  void,
  { rejectValue: string }
>("swaps/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/swaps");
    return res.data.data.swaps;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to fetch swaps"));
  }
});

export const fetchSwapPartners = createAsyncThunk<
  SwapPartner[],
  string | void,
  { rejectValue: string }
>("swaps/fetchPartners", async (search, thunkAPI) => {
  try {
    const params = search ? { search } : {};
    const res = await axiosInstance.get("/swaps/partners", { params });
    return res.data.data.partners;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to fetch swap partners"));
  }
});

export const requestSwap = createAsyncThunk<
  SkillSwap,
  RequestSwapPayload,
  { rejectValue: string }
>("swaps/request", async (payload, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/swaps", payload);
    return res.data.data.swap;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to send swap request"));
  }
});

export const respondToSwap = createAsyncThunk<
  SkillSwap,
  { swapId: string; action: "accepted" | "rejected" },
  { rejectValue: string }
>("swaps/respond", async ({ swapId, action }, thunkAPI) => {
  try {
    const res = await axiosInstance.patch(`/swaps/${swapId}/respond`, { action });
    return res.data.data.swap;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to respond to swap"));
  }
});

export const cancelSwap = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("swaps/cancel", async (swapId, thunkAPI) => {
  try {
    await axiosInstance.delete(`/swaps/${swapId}`);
    return swapId;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to cancel swap"));
  }
});

export const completeSwap = createAsyncThunk<
  SkillSwap,
  string,
  { rejectValue: string }
>("swaps/complete", async (swapId, thunkAPI) => {
  try {
    const res = await axiosInstance.patch(`/swaps/${swapId}/complete`);
    return res.data.data.swap;
  } catch (error) {
    return thunkAPI.rejectWithValue(extractError(error, "Failed to complete swap"));
  }
});

// ─── SLICE ───────────────────────────────────────────────────────────────────

const swapSlice = createSlice({
  name: "swaps",
  initialState,
  reducers: {
    clearSwapError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMySwaps
      .addCase(fetchMySwaps.pending, (state) => {
        state.loadingSwaps = true;
        state.error = null;
      })
      .addCase(fetchMySwaps.fulfilled, (state, action) => {
        state.loadingSwaps = false;
        state.swaps = action.payload;
      })
      .addCase(fetchMySwaps.rejected, (state, action) => {
        state.loadingSwaps = false;
        state.error = action.payload as string;
      })

      // fetchSwapPartners
      .addCase(fetchSwapPartners.pending, (state) => {
        state.loadingPartners = true;
        state.error = null;
      })
      .addCase(fetchSwapPartners.fulfilled, (state, action) => {
        state.loadingPartners = false;
        state.swapPartners = action.payload;
      })
      .addCase(fetchSwapPartners.rejected, (state, action) => {
        state.loadingPartners = false;
        state.error = action.payload as string;
      })

      // requestSwap
      .addCase(requestSwap.pending, (state) => {
        state.loadingAction = true;
        state.error = null;
      })
      .addCase(requestSwap.fulfilled, (state, action) => {
        state.loadingAction = false;
        state.swaps.unshift(action.payload);
      })
      .addCase(requestSwap.rejected, (state, action) => {
        state.loadingAction = false;
        state.error = action.payload as string;
      })

      // respondToSwap
      .addCase(respondToSwap.pending, (state) => {
        state.loadingAction = true;
        state.error = null;
      })
      .addCase(respondToSwap.fulfilled, (state, action) => {
        state.loadingAction = false;
        const idx = state.swaps.findIndex((s) => s._id === action.payload._id);
        if (idx !== -1) state.swaps[idx] = action.payload;
        // If accepted, add to partners
        if (action.payload.status === "accepted") {
          const currentUserId = action.payload.recipient._id;
          const partner = {
            swapId: action.payload._id,
            user: action.payload.requester,
            offeredSkill: action.payload.requesterOffersSkill,
            wantedSkill: action.payload.requesterWantsSkill,
          };
          const alreadyExists = state.swapPartners.some((p) => p.swapId === partner.swapId);
          if (!alreadyExists) state.swapPartners.push(partner);
        }
      })
      .addCase(respondToSwap.rejected, (state, action) => {
        state.loadingAction = false;
        state.error = action.payload as string;
      })

      // cancelSwap
      .addCase(cancelSwap.pending, (state) => {
        state.loadingAction = true;
        state.error = null;
      })
      .addCase(cancelSwap.fulfilled, (state, action) => {
        state.loadingAction = false;
        const idx = state.swaps.findIndex((s) => s._id === action.payload);
        if (idx !== -1) state.swaps[idx].status = "cancelled";
      })
      .addCase(cancelSwap.rejected, (state, action) => {
        state.loadingAction = false;
        state.error = action.payload as string;
      })

      // completeSwap
      .addCase(completeSwap.pending, (state) => {
        state.loadingAction = true;
        state.error = null;
      })
      .addCase(completeSwap.fulfilled, (state, action) => {
        state.loadingAction = false;
        const swapIdx = state.swaps.findIndex((s) => s._id === action.payload._id);
        if (swapIdx !== -1) state.swaps[swapIdx] = action.payload;
        const partnerIdx = state.swapPartners.findIndex((p) => p.swapId === action.payload._id);
        if (partnerIdx !== -1) state.swapPartners[partnerIdx].status = "completed";
      })
      .addCase(completeSwap.rejected, (state, action) => {
        state.loadingAction = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSwapError } = swapSlice.actions;
export default swapSlice.reducer;
