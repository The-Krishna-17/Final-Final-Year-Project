// ─────────────────────────────────────────────────────────────────────────────
// AI-EXTRACTED DATA
// Structured knowledge the LLM extracts from the skill description.
// The user never writes to this directly.
// ─────────────────────────────────────────────────────────────────────────────

export interface AISkillData {
  primarySkill: string;
  domain: string;
  category: string;
  topics: string[];
  technologies: string[];
  aliases: string[];
  keywords: string[];
  relatedSkills: string[];
  confidence: number;
  needsClarification: boolean;
  clarificationQuestion: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// SKILL ITEM  (a single entry in offer or want list)
// ─────────────────────────────────────────────────────────────────────────────

export interface SkillItem {
  _id: string;

  // Raw input from the user
  rawInput: string;

  // User-provided fields (never modified by AI)
  currentLevel: "Beginner" | "Intermediate" | "Advanced" | null;
  experience: string | null;
  goal: string | null;
  preferredLearningStyle: "Project Based" | "Theory First" | "Hands-on" | "Flexible" | null;
  preferredSessionMode: "Online" | "Offline" | "Hybrid" | null;
  availability: "Weekends" | "Weekdays" | "Evenings" | null;
  preferredLanguage: "English" | "Nepali" | null;

  // AI-extracted structured knowledge
  ai: AISkillData;

  // Flat token index for search + matching
  searchTokens: string[];

  processedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// FORM STATE  (what the multi-step add-skill dialog captures)
// ─────────────────────────────────────────────────────────────────────────────

export interface SkillFormState {
  description: string;
  currentLevel: "Beginner" | "Intermediate" | "Advanced" | "";
  experience: string;
  goal: string;
  preferredLearningStyle: "Project Based" | "Theory First" | "Hands-on" | "Flexible" | "";
  preferredSessionMode: "Online" | "Offline" | "Hybrid" | "";
  availability: "Weekends" | "Weekdays" | "Evenings" | "";
  preferredLanguage: "English" | "Nepali" | "";
}

// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW OBJECT  (returned by POST /skills/preview)
// ─────────────────────────────────────────────────────────────────────────────

export interface SkillPreview {
  rawInput: string;
  currentLevel: string | null;
  experience: string | null;
  goal: string | null;
  preferredLearningStyle: string | null;
  preferredSessionMode: string | null;
  availability: string | null;
  preferredLanguage: string | null;
  ai: AISkillData;
  searchTokens: string[];
  processedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// REDUX STATE
// ─────────────────────────────────────────────────────────────────────────────

export interface SkillState {
  profile: SkillProfile | null;
  loadingProfile: boolean;
  errorProfile: string | null;

  // Preview (Step 1)
  preview: SkillPreview | null;
  loadingPreview: boolean;
  errorPreview: string | null;

  // Add
  loadingAddOffer: boolean;
  errorAddOffer: string | null;
  loadingAddWant: boolean;
  errorAddWant: string | null;

  // Update
  loadingUpdate: boolean;
  errorUpdate: string | null;

  // Remove
  loadingRemove: boolean;
  errorRemove: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// PAYLOADS
// ─────────────────────────────────────────────────────────────────────────────

export interface AddSkillPayload {
  description: string;
  currentLevel?: string;
  experience?: string;
  goal?: string;
  preferredLearningStyle?: string;
  preferredSessionMode?: string;
  availability?: string;
  preferredLanguage?: string;
}

export interface UpdateSkillPayload {
  skillId: string;
  listType: "offer" | "want";
  currentLevel?: "Beginner" | "Intermediate" | "Advanced";
  goal?: string;
  experience?: string;
  preferredLearningStyle?: string;
  preferredSessionMode?: string;
  availability?: string;
  preferredLanguage?: string;
}

export interface RemoveSkillPayload {
  skillId: string;
  listType: "offer" | "want";
}

// ─────────────────────────────────────────────────────────────────────────────
// API RESPONSES
// ─────────────────────────────────────────────────────────────────────────────

export interface SkillResponse {
  success: boolean;
  message: string;
  data: {
    profile: SkillProfile;
  };
}

export interface PreviewResponse {
  success: boolean;
  message: string;
  data: {
    preview: SkillPreview;
    needsClarification?: boolean;
    clarificationQuestion?: string;
  };
}
