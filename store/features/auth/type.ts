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

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string | null;
  isEmailVerified: boolean;
  lastLogin: string | null;
  _id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  isLocked: boolean;
  id: string;
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

  loadingVerifyEmail: boolean;
  errorVerifyEmail: AuthError | null;
  successVerifyEmail: string | null;

  loadingChangePassword: boolean;
  errorChangePassword: AuthError | null;
  successChangePassword: string | null;

  loadingLogout: boolean;
}
