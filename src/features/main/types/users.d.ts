export interface IUserProfile {
  id: string;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileBody {
  firstName: string;
  lastName: string;
  profilePhoto?: string | null;
  phone: string;
}

export interface ChangePasswordBody {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}