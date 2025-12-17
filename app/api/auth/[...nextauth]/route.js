import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/db';
import { ObjectId } from 'mongodb';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: process.env.NEXTAUTH_DATABASE || 'VishalCarWash',
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          _id: new ObjectId().toString(), // Ensure we have a valid _id
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'user',
        };
      },
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          await dbConnect();
          
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Please provide email and password');
          }
          
          // Case-insensitive email search
          const user = await User.findOne({ 
            email: { $regex: new RegExp(`^${credentials.email}$`, 'i') } 
          }).select('+password');
          
          if (!user) {
            throw new Error('No user found with this email');
          }
          
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }
          
          // Return user object with ID and required fields
          return {
            id: user._id.toString(),
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || 'user',
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw new Error(error.message || 'An error occurred during authentication');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      // Add user ID and role to the token when user signs in
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      }
      return token;
    },
    session: async ({ session, token }) => {
      // Add user ID and role to the session
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    newUser: '/auth/signup',
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };