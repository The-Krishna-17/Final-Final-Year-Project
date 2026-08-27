export interface RegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password?: string;
  confirmPassword?: string;
}

export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// ─── Extended Profile Types ───────────────────────────────────────────────────

export interface DateField {
  year: number;
  month: number;  // 1–12
  day?: number | null;
}

export interface WorkExperience {
  _id?: string;
  id?: string;
  company: string;
  role: string;
  startDate: DateField;
  endDate: DateField | null; // null = Present / Ongoing
  description?: string | null;
}

/** currentWork has the exact same shape as a WorkExperience entry */
export type CurrentWork = Omit<WorkExperience, "_id" | "id"> & { _id?: string; id?: string };

export interface SocialLinks {
  linkedin?: string | null;
  github?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  website?: string | null;
  facebook?: string | null;
}

// ─── Core User Shape ──────────────────────────────────────────────────────────

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string | null;
  lastLogin: string | null;
  _id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  isLocked: boolean;
  id: string;

  // Extended profile
  bio?: string | null;
  currentWork?: CurrentWork | null;
  workExperience?: WorkExperience[];
  socialLinks?: SocialLinks;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: UserData;
    accessToken?: string;
  };
}

export interface GenericResponse {
  success: boolean;
  message: string;
}

export interface AuthError {
  global?: string;
  fields?: Record<string, string>;
}

export interface AuthState {
  user: UserData | null;

  loadingRegister: boolean;
  errorRegister: AuthError | null;

  loadingLogin: boolean;
  errorLogin: AuthError | null;

  loadingMe: boolean;
  errorMe: AuthError | null;

  loadingForgotPassword: boolean;
  errorForgotPassword: AuthError | null;
  successForgotPassword: string | null;

  loadingResetPassword: boolean;
  errorResetPassword: AuthError | null;
  successResetPassword: string | null;

  loadingChangePassword: boolean;
  errorChangePassword: AuthError | null;
  successChangePassword: string | null;

  loadingLogout: boolean;
}

