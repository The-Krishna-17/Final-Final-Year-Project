export interface SkillItem {
  _id: string;
  rawInput: string;
  domain: string;
  primarySkill: {
    name: string;
    category: string;
  };
  topics: string[];
  technologies: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tokens: string[];
  processedAt: string;
}

export type DateStruct = {
  year: number;
  month: number;
  day: number;
};

export type CurrentWork = {
  startDate: DateStruct;
  endDate: DateStruct | null;
  company: string;
  role: string;
  description: string;
};

export type UserProfile = {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: "user" | "admin" | string;
  avatar: string;
  bio: string;
  isLocked: boolean;
  currentWork: CurrentWork;
};

export interface SkillProfile {
  _id: string;
  user: UserProfile;
  offerSkills: SkillItem[];
  wantSkills: SkillItem[];
  availability: "available" | "busy" | "not_looking";
  location: { city?: string; country?: string };
  mode: "online" | "offline" | "both";
  reputationScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface SkillState {
  profile: SkillProfile | null;
  loadingProfile: boolean;
  errorProfile: string | null;

  loadingAddOffer: boolean;
  errorAddOffer: string | null;

  loadingAddWant: boolean;
  errorAddWant: string | null;

  loadingUpdate: boolean;
  errorUpdate: string | null;

  loadingRemove: boolean;
  errorRemove: string | null;
}

// Payloads
export interface AddSkillPayload {
  name: string; // natural language raw input
}

export interface UpdateSkillPayload {
  skillId: string;
  listType: "offer" | "want";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface RemoveSkillPayload {
  skillId: string;
  listType: "offer" | "want";
}

export interface SkillResponse {
  success: boolean;
  message: string;
  data: {
    profile: SkillProfile;
  };
}
