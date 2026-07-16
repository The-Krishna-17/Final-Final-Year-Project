export interface UserBasicInfo {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface Meeting {
  _id: string;
  title: string;
  description?: string;
  roomId: string;
  host: UserBasicInfo;
  participants: UserBasicInfo[];
  invitedUsers: UserBasicInfo[];
  scheduledAt: string;
  startedAt?: string;
  endedAt?: string;
  duration?: number;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface MeetingState {
  meetings: Meeting[];
  currentMeeting: Meeting | null;
  loadingMeetings: boolean;
  loadingCurrent: boolean;
  loadingAction: boolean;
  errorMeetings: string | null;
  errorCurrent: string | null;
  errorAction: string | null;
}

export interface CreateMeetingPayload {
  title: string;
  description?: string;
  scheduledAt: string;
  invitedUsers?: string[];
}

export interface UpdateMeetingPayload {
  roomId: string;
  title?: string;
  description?: string;
  scheduledAt?: string;
  status?: "scheduled" | "ongoing" | "completed" | "cancelled";
  invitedUsers?: string[];
}

export interface MeetingResponse {
  success: boolean;
  message: string;
  data: {
    meeting: Meeting;
  };
}

export interface MeetingsResponse {
  success: boolean;
  message: string;
  data: {
    meetings: Meeting[];
  };
}
