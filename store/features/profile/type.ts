import { AuthError } from "../auth/type";

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
}

export interface UploadAvatarPayload {
  avatar: string;
}

export interface ProfileState {
  loadingUpdateProfile: boolean;
  errorUpdateProfile: AuthError | null;

  loadingUploadAvatar: boolean;
  errorUploadAvatar: AuthError | null;

  loadingDeactivateAccount: boolean;
  errorDeactivateAccount: AuthError | null;
}
