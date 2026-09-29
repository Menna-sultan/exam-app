import { USER_RULES } from "../constants/user.constant";
export type UserRole = typeof USER_RULES[keyof typeof USER_RULES];
export interface User { 
     id: string,
    username: string,
    email: string,
    phone: string | null,
    firstName: string,
    lastName: string,
    profilePhoto: string,
    emailVerified: boolean,
    phoneVerified: boolean,
    role: UserRole,

  }