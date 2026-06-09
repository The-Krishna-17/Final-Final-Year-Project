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

export interface SkillProfile {
  _id: string;
  user: any; // Can be typed fully if User interface exists
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
