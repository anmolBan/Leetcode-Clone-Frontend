import { DefaultSession } from "next-auth";

declare module "next-auth"{
  interface Session{
      user: {
          id: string | unknown;
          username: string | unknown;
      }  & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
      username: string | unknown;
  }
}

declare module "next-auth"{
  interface User{
    username: string | unknown;
  }
}