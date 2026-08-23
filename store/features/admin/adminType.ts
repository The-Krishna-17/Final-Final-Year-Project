export interface OverviewStats {
  users: {
    total: number;
    verified: number;
    locked: number;
    roles: Record<string, number>;
  };
  skills: {
    totalProfiles: number;
    totalOffers: number;
    totalWants: number;
    topOffers: { skill: string; count: number }[];
    topWants: { skill: string; count: number }[];
  };
  swaps: {
    total: number;
    breakdown: Record<string, number>;
  };
  meetings: {
    total: number;
    breakdown: Record<string, number>;
  };
  reviews: {
    total: number;
    avgRating: number;
  };
}

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin" | "moderator";
  avatar: string | null;
  bio: string | null;
  isEmailVerified: boolean;
  lockUntil: string | null;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface LowConfidenceSkill {
  profileId: string;
  skillId: string;
  userId: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  rawInput: string;
  currentLevel: string | null;
  ai: {
    primarySkill: string;
    domain: string;
    category: string;
    confidence: number;
    needsClarification: boolean;
    clarificationQuestion?: string;
  };
  type: "offer" | "want";
}

export interface SkillsTaxonomy {
  domainCounts: Record<string, number>;
  lowConfidenceQueue: LowConfidenceSkill[];
}

export interface AdminSwap {
  _id: string;
  requester: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  recipient: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  requesterOffersSkill?: string;
  requesterWantsSkill?: string;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface AdminReview {
  _id: string;
  reviewer: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  reviewee: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  rating: number;
  feedback: string;
  createdAt: string;
}

export interface AdminMeeting {
  _id: string;
  title: string;
  description?: string;
  roomId: string;
  host: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  participants: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  }[];
  scheduledAt: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  createdAt: string;
}

export interface AdminState {
  overview: OverviewStats | null;
  loadingOverview: boolean;

  users: AdminUser[];
  pagination: Pagination | null;
  loadingUsers: boolean;

  taxonomy: SkillsTaxonomy | null;
  loadingTaxonomy: boolean;

  swaps: AdminSwap[];
  loadingSwaps: boolean;

  reviews: AdminReview[];
  loadingReviews: boolean;

  meetings: AdminMeeting[];
  loadingMeetings: boolean;

  actionLoading: boolean;
  error: string | null;
}
