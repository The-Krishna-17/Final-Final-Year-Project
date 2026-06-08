import {
  AuthError,
  WorkExperience,
  SocialLinks,
  CurrentWork,
} from "../auth/type";

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  bio?: string | null;
  currentWork?: CurrentWork | null;
  workExperience?: WorkExperience[];
  socialLinks?: SocialLinks;
}

export interface UploadAvatarPayload {
  avatar: string;
}

export interface ProfileState {
  loadingGetProfile: boolean;
  errorGetProfile: AuthError | null;

  loadingUpdateProfile: boolean;
  errorUpdateProfile: AuthError | null;

  loadingUploadAvatar: boolean;
  errorUploadAvatar: AuthError | null;

  loadingDeleteAvatar: boolean;
  errorDeleteAvatar: AuthError | null;

  loadingDeactivateAccount: boolean;
  errorDeactivateAccount: AuthError | null;
}
