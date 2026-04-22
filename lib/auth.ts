// lib/auth.ts
// authOptions lives here so it can be imported by any API route
// without violating Next.js 14 App Router rules (route files may only
// export GET, POST, etc. — not arbitrary named exports).

import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user) {
          throw new Error('No account found with that email');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id:    user._id.toString(),
          name:  user.name,
          email: user.email,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    // Keep users signed in for 30 days.
    maxAge: 30 * 24 * 60 * 60,
    // Refresh the session expiry every 24 hours while active.
    updateAge: 24 * 60 * 60,
  },
  jwt: {
    // Align JWT expiry with session expiry.
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id   = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; name?: string | null; email?: string | null }).id = token.id as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error:  '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
