import { UserData } from "../auth/type";
import { SkillProfile, SkillItem } from "../skills/type";

export interface ScoreBreakdown {
  directMatch: number;
  tokenSimilarity: number;
  domainSimilarity: number;
  difficultyBonus: number;
}

export interface MatchDetails {
  aWantsB?: {
    score: number;
    wantSkill: SkillItem;
    offerSkill: SkillItem;
    breakdown?: ScoreBreakdown;
  };
  bWantsA?: {
    score: number;
    wantSkill: SkillItem;
    offerSkill: SkillItem;
    breakdown?: ScoreBreakdown;
  };
  isMutual?: boolean;
  reputationBoost?: number;
  modeCompatible?: boolean;
}

export interface MatchProfile {
  profileId: string;
  userId: string;
  userProfile: SkillProfile;
  totalScore: number;
  matchDetails: MatchDetails;
  matchPercent: string;
}

export interface MatchState {
  recommendedMatches: MatchProfile[];
  mutualMatches: MatchProfile[];
  searchResults: MatchProfile[];
  filteredMatches: MatchProfile[];

  recommendedPagination: any;
  mutualPagination: any;
  searchPagination: any;
  filterPagination: any;

  loadingRecommended: boolean;
  loadingMutual: boolean;
  loadingSearch: boolean;
  loadingFilter: boolean;

  error: string | null;
}
