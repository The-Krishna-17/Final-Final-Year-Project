// Types for the SkillSwap feature

export interface SwapUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface SkillSwap {
  _id: string;
  requester: SwapUser;
  recipient: SwapUser;
  requesterOffersSkill?: string;
  requesterWantsSkill?: string;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SwapPartner {
  swapId: string;
  user: SwapUser;
  offeredSkill?: string;
  wantedSkill?: string;
}

export interface SwapState {
  swaps: SkillSwap[];
  swapPartners: SwapPartner[];
  loadingSwaps: boolean;
  loadingPartners: boolean;
  loadingAction: boolean;
  error: string | null;
}

export interface RequestSwapPayload {
  recipientId: string;
  requesterOffersSkill?: string;
  requesterWantsSkill?: string;
  message?: string;
}
