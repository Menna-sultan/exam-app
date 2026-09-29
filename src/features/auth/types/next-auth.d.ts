// يعني بنقول:

// ضيف معلومات إضافية لـ Session اللي أنت أصلاً عاملها
import "next-auth"
import {user as UserType} from "./user"

import "next-auth/jwt" 
/**
 * The shape of the user object returned in the OAuth providers' `profile` callback,
 * or the second parameter of the `session` callback, when using a database.
 */



declare module "next-auth/jwt" {

 interface JWT {
   user: UserType
   token: string
 }
}
declare module "next-auth" {
  interface User {
    user: UserType;
    token: string;
  }

  interface Session {
    user: UserType;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: UserType;
    token: string;
  }
}