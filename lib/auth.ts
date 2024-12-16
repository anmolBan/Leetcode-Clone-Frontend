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
          email: { label: "Email", type: "text", placeholder: "xyz@gmail.com" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
            try{
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials?.email
                    }
                });
                const hashedPassword = await bcrypt.hash(credentials?.password || "", 10);
                if(!user){
                    const newUser = await prisma.user.create({
                        data: {
                            email: credentials?.email || "",
                            password: hashedPassword
                        }
                    });
                    return newUser;
                }
                else{
                    const isPasswordValid = await bcrypt.compare(credentials?.password || "", user.password || "");
                    if(!isPasswordValid){
                        throw new Error("Invalid Credentials");
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
                        email: user.email
                    }
                });
                user.id = newUser.id
            }
            user.id = existingUser?.id || ""
            return true;

        } catch(error){
            console.error("Error during signin callback", error);
            return false;
        }
    },
    async jwt({ token, user } : {token: JWT, user: User}){
        if(user){
            token.id = user.id;
        }
        return token;
    },
    async session({session, token} : { session: Session, token: JWT}){
        if(session.user){
            session.user.id = token.id
        }
        return session;
    }
  }
}
export default NextAuth(authOptions);