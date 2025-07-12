export interface User {
  id: string;
  email: string;
  username: string;
  country: string;
  state: string;
  profile_picture_path?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthFormData {
  email: string;
  username?: string;
  password: string;
  country?: string;
  state?: string;
  profilePicture?: File;
}

export interface AuthState {
  isLoading: boolean;
  error: string | null;
  user: User | null;
  emailVerificationSent: boolean;
  showEmailForm: boolean;
  showAccountSetup: boolean;
  setupSuccess: boolean;
  verificationToken: string | null;
}
