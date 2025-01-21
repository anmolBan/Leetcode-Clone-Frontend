import { DefaultSession } from "next-auth";

declare module "next-auth"{
  interface Session{
      user: {
          id: string;
          username: string | unknown;
      }  & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string | unknown;
  }
}

declare module "next-auth"{
  interface User{
    username: string | unknown;
  }
}