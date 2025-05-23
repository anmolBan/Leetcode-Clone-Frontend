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
        async authorize(credentials) {
            try{
                const res = await prisma.user.findFirst({
                    where: {
                        OR : [
                            {email: credentials?.emailOrUsername || ""},
                            {username: credentials?.emailOrUsername || ""}
                        ]
                    }
                });
                if(!res){
                    throw new Error("Invalid Credentials");
                }
                else{
                    const isPasswordValid = await bcrypt.compare(credentials?.password || "", res.password || "");
                    if(!isPasswordValid){
                        throw new Error("Invalid Password");
                    }
                    return {
                        id: res.id,
                        name: res.name || "",
                        email: res.email,
                        username: res.username || "",
                        isAdmin: res.isAdmin
                    }
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
                if(!newUser.username){
                    return false;
                }
                user.id = newUser.id;
                user.username = newUser.username;
                user.isAdmin = false;
                return true;
            }
            user.id = existingUser?.id || "";
            user.username = existingUser?.username || "";
            user.isAdmin = existingUser.isAdmin;
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
            token.isAdmin = user.isAdmin;
        }
        return token;
    },
    async session({session, token} : { session: Session, token: JWT}){
        if(session.user){
            session.user.id = token.id;
            session.user.username = token.username
            session.user.isAdmin = token.isAdmin
        }
        return session;
    }
  }
}
export default NextAuth(authOptions);