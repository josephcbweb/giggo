import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { connectMongoDB } from "./lib/mongodb";
import { User } from "./models/User";
import { compare } from "bcryptjs";

export const { handlers, auth, signIn } = NextAuth({
  providers: [
    Google,
    GitHub,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        await connectMongoDB();
        const email = credentials.email as string;
        const password = credentials.password as string;
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        const userData = {
          name: user.name,
          email: user.email,
          id: user._id.toString(),
          image: user.image,
          phone: user.phone,
        };

        return userData;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add user details to the token
        token.id = user.id; // Use the MongoDB _id
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        // Pass the MongoDB _id to the session
        session.user.id = token.id as string;
      }
      if (token?.picture) {
        session.user.image = token.picture;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          const { email, name, image, id } = user;
          await connectMongoDB();

          const existingUser = await User.findOne({ email });

          if (!existingUser) {
            // Create a new user if they don't exist
            const newUser = await User.create({
              email,
              name,
              imageUrl: image,
              authProviderId: id,
            });
            user.id = newUser._id.toString(); // Use the MongoDB _id
          } else {
            // Use the existing user's MongoDB _id
            user.id = existingUser._id.toString();
          }

          return true;
        } catch (error) {
          console.error("Error during sign-in:", error);
          throw new Error("Error while creating or fetching the user");
        }
      }

      if (account?.provider === "credentials") {
        // For credentials login, the user.id is already set to the MongoDB _id
        return true;
      }

      return false;
    },
  },
});