import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  SkillState,
  SkillResponse,
  AddSkillPayload,
  UpdateSkillPayload,
  RemoveSkillPayload,
} from "./type";
import axios from "axios";

const initialState: SkillState = {
  profile: null,

  loadingProfile: false,
  errorProfile: null,

  loadingAddOffer: false,
  errorAddOffer: null,

  loadingAddWant: false,
  errorAddWant: null,

  loadingUpdate: false,
  errorUpdate: null,

  loadingRemove: false,
  errorRemove: null,
};

// Error extractor helper
const extractError = (error: unknown, defaultMessage: string): string => {
  if (axios.isAxiosError(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return defaultMessage;
};

// ─── THUNKS ───────────────────────────────────────────────────────────────

export const getUserSkills = createAsyncThunk<
  SkillResponse,
  string, // userId
  { rejectValue: string }
>("skills/getUserSkills", async (userId, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/skills/user/${userId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      extractError(error, "Failed to fetch skills"),
    );
  }
});

export const addOfferSkill = createAsyncThunk<
  SkillResponse,
  AddSkillPayload,
  { rejectValue: string }
>("skills/addOffer", async (payload, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/skills/add-offer", payload);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      extractError(error, "Failed to add offered skill"),
    );
  }
});

export const addWantSkill = createAsyncThunk<
  SkillResponse,
  AddSkillPayload,
  { rejectValue: string }
>("skills/addWant", async (payload, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/skills/add-want", payload);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      extractError(error, "Failed to add wanted skill"),
    );
  }
});

export const updateSkill = createAsyncThunk<
  SkillResponse,
  UpdateSkillPayload,
  { rejectValue: string }
>("skills/updateSkill", async (payload, thunkAPI) => {
  try {
    const response = await axiosInstance.put("/skills/update", payload);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      extractError(error, "Failed to update skill"),
    );
  }
});

export const removeSkill = createAsyncThunk<
  SkillResponse,
  RemoveSkillPayload,
  { rejectValue: string }
>("skills/removeSkill", async (payload, thunkAPI) => {
  try {
    // Axios requires data inside a 'data' property for DELETE requests
    const response = await axiosInstance.delete("/skills/remove-skill", {
      data: payload,
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(
      extractError(error, "Failed to remove skill"),
    );
  }
});

// ─── SLICE ────────────────────────────────────────────────────────────────

const skillSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {
    clearSkillErrors: (state) => {
      state.errorProfile = null;
      state.errorAddOffer = null;
      state.errorAddWant = null;
      state.errorUpdate = null;
      state.errorRemove = null;
    },
  },
  extraReducers: (builder) => {
    // Get Profile
    builder
      .addCase(getUserSkills.pending, (state) => {
        state.loadingProfile = true;
        state.errorProfile = null;
      })
      .addCase(getUserSkills.fulfilled, (state, action) => {
        state.loadingProfile = false;
        state.profile = action.payload.data.profile;
      })
      .addCase(getUserSkills.rejected, (state, action) => {
        state.loadingProfile = false;
        state.errorProfile = action.payload as string;
      });

    // Add Offer
    builder
      .addCase(addOfferSkill.pending, (state) => {
        state.loadingAddOffer = true;
        state.errorAddOffer = null;
      })
      .addCase(addOfferSkill.fulfilled, (state, action) => {
        state.loadingAddOffer = false;
        state.profile = action.payload.data.profile;
      })
      .addCase(addOfferSkill.rejected, (state, action) => {
        state.loadingAddOffer = false;
        state.errorAddOffer = action.payload as string;
      });

    // Add Want
    builder
      .addCase(addWantSkill.pending, (state) => {
        state.loadingAddWant = true;
        state.errorAddWant = null;
      })
      .addCase(addWantSkill.fulfilled, (state, action) => {
        state.loadingAddWant = false;
        state.profile = action.payload.data.profile;
      })
      .addCase(addWantSkill.rejected, (state, action) => {
        state.loadingAddWant = false;
        state.errorAddWant = action.payload as string;
      });

    // Update Skill
    builder
      .addCase(updateSkill.pending, (state) => {
        state.loadingUpdate = true;
        state.errorUpdate = null;
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        state.profile = action.payload.data.profile;
      })
      .addCase(updateSkill.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.errorUpdate = action.payload as string;
      });

    // Remove Skill
    builder
      .addCase(removeSkill.pending, (state) => {
        state.loadingRemove = true;
        state.errorRemove = null;
      })
      .addCase(removeSkill.fulfilled, (state, action) => {
        state.loadingRemove = false;
        state.profile = action.payload.data.profile;
      })
      .addCase(removeSkill.rejected, (state, action) => {
        state.loadingRemove = false;
        state.errorRemove = action.payload as string;
      });
  },
});

export const { clearSkillErrors } = skillSlice.actions;

export default skillSlice.reducer;
