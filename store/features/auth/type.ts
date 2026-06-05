export interface RegisterUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: UserData;
    accessToken: string;
  };
}

export interface AuthError {
  global?: string;
  fields?: Record<string, string>;
}

export interface AuthState {
  user: RegisterResponse | null;
  loadingRegister: boolean;
  errorRegister: AuthError | null;
}
