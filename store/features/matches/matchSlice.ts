import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { MatchState, MatchProfile } from "./type";
import { axiosInstance } from "@/utils/axiosInstance";

const initialState: MatchState = {
  recommendedMatches: [],
  mutualMatches: [],
  searchResults: [],
  filteredMatches: [],
  
  recommendedPagination: null,
  mutualPagination: null,
  searchPagination: null,
  filterPagination: null,

  loadingRecommended: false,
  loadingMutual: false,
  loadingSearch: false,
  loadingFilter: false,
  error: null,
};

// ─── THUNKS ─────────────────────────────────────────────────────────────────

export const fetchRecommendedMatches = createAsyncThunk(
  "matches/fetchRecommended",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/matches/recommended?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch recommended matches",
      );
    }
  },
);

export const fetchMutualMatches = createAsyncThunk(
  "matches/fetchMutual",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/matches/mutual?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch mutual matches",
      );
    }
  },
);

export const searchMatches = createAsyncThunk(
  "matches/search",
  async ({ query, page = 1, limit = 10 }: { query: string; page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/matches/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Search failed");
    }
  },
);

interface FilterParams {
  mode?: string;
  availability?: string;
  domain?: string;
  minReputation?: number;
  difficulty?: string;
  page?: number;
  limit?: number;
}

export const filterMatches = createAsyncThunk(
  "matches/filter",
  async (params: FilterParams, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params as any).toString();
      const response = await axiosInstance.get(`/matches/filter?${queryString}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Filter failed");
    }
  },
);

// ─── SLICE ──────────────────────────────────────────────────────────────────

const matchSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    clearSearch(state) {
      state.searchResults = [];
    },
    clearFilters(state) {
      state.filteredMatches = [];
    },
    clearMatchError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Recommended
      .addCase(fetchRecommendedMatches.pending, (state) => {
        state.loadingRecommended = true;
        state.error = null;
      })
      .addCase(
        fetchRecommendedMatches.fulfilled,
        (state, action: PayloadAction<{ matches: MatchProfile[]; pagination: any }>) => {
          state.loadingRecommended = false;
          if (action.payload.pagination.page === 1) {
            state.recommendedMatches = action.payload.matches;
          } else {
            state.recommendedMatches = [...state.recommendedMatches, ...action.payload.matches];
          }
          state.recommendedPagination = action.payload.pagination;
        },
      )
      .addCase(fetchRecommendedMatches.rejected, (state, action) => {
        state.loadingRecommended = false;
        state.error = action.payload as string;
      })

      // Mutual
      .addCase(fetchMutualMatches.pending, (state) => {
        state.loadingMutual = true;
        state.error = null;
      })
      .addCase(
        fetchMutualMatches.fulfilled,
        (state, action: PayloadAction<{ matches: MatchProfile[]; pagination: any }>) => {
          state.loadingMutual = false;
          if (action.payload.pagination.page === 1) {
            state.mutualMatches = action.payload.matches;
          } else {
            state.mutualMatches = [...state.mutualMatches, ...action.payload.matches];
          }
          state.mutualPagination = action.payload.pagination;
        },
      )
      .addCase(fetchMutualMatches.rejected, (state, action) => {
        state.loadingMutual = false;
        state.error = action.payload as string;
      })

      // Search
      .addCase(searchMatches.pending, (state) => {
        state.loadingSearch = true;
        state.error = null;
      })
      .addCase(
        searchMatches.fulfilled,
        (state, action: PayloadAction<{ matches: MatchProfile[]; pagination: any }>) => {
          state.loadingSearch = false;
          if (action.payload.pagination.page === 1) {
            state.searchResults = action.payload.matches;
          } else {
            state.searchResults = [...state.searchResults, ...action.payload.matches];
          }
          state.searchPagination = action.payload.pagination;
        },
      )
      .addCase(searchMatches.rejected, (state, action) => {
        state.loadingSearch = false;
        state.error = action.payload as string;
      })

      // Filter
      .addCase(filterMatches.pending, (state) => {
        state.loadingFilter = true;
        state.error = null;
      })
      .addCase(
        filterMatches.fulfilled,
        (state, action: PayloadAction<{ matches: MatchProfile[]; pagination: any }>) => {
          state.loadingFilter = false;
          if (action.payload.pagination.page === 1) {
            state.filteredMatches = action.payload.matches;
          } else {
            state.filteredMatches = [...state.filteredMatches, ...action.payload.matches];
          }
          state.filterPagination = action.payload.pagination;
        },
      )
      .addCase(filterMatches.rejected, (state, action) => {
        state.loadingFilter = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSearch, clearFilters, clearMatchError } =
  matchSlice.actions;

export default matchSlice.reducer;
