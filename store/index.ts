import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import profileReducer from "./features/profile/profileSlice";
import skillReducer from "./features/skills/skillSlice";
import matchReducer from "./features/matches/matchSlice";
import meetingReducer from "./features/meetings/meetingSlice";
import swapReducer from "./features/swaps/swapSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    skills: skillReducer,
    matches: matchReducer,
    meetings: meetingReducer,
    swaps: swapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
