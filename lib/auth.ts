import NextAuth, { Session, User } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/db"
import bcrypt from "bcrypt"
import { JWT } from "next-auth/jwt"
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || ""
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }),
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
          emailOrUsername: { label: "Email/Username", type: "text", placeholder: "xyz@gmail.com" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
            try{
                const user = await prisma.user.findFirst({
                    where: {
                        OR : [
                            {email: credentials?.emailOrUsername || ""},
                            {username: credentials?.emailOrUsername || ""}
                        ]
                    }
                });
                if(!user){
                    throw new Error("Invalid Credentials");
                }
                else{
                    const isPasswordValid = await bcrypt.compare(credentials?.password || "", user.password || "");
                    if(!isPasswordValid){
                        throw new Error("Invalid Password");
                    }
                    return user;
                }
            } catch(error){
                console.error("Error during authrization: ", error);
                return null;
            }
        }
    })
  ],
  secret: "anmolbansecret",
  callbacks: {
    async signIn({ user } : {user : User}){
        if(!user.email){
            return false;
        }

        try{
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: user.email
                }
            });

            if(!existingUser){
                const newUser = await prisma.user.create({
                    data: {
                        email: user.email,
                        name: user.name,
                        username: user.email
                    }
                });
                user.id = newUser.id
            }
            user.id = existingUser?.id || ""
            user.username = existingUser?.username || ""
            return true;

        } catch(error){
            console.error("Error during signin callback", error);
            return false;
        }
    },
    async jwt({ token, user } : {token: JWT, user: User}){
        if(user){
            token.id = user.id;
            token.username = user.username;
        }
        return token;
    },
    async session({session, token} : { session: Session, token: JWT}){
        if(session.user){
            session.user.id = token.id;
            session.user.username = token.username
        }
        return session;
    }
  }
}
export default NextAuth(authOptions);