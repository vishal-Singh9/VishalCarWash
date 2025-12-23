import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '@/models/User';
import dbConnect from '@/lib/db';
import { ObjectId } from 'mongodb';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: process.env.NEXTAUTH_DATABASE || 'VishalCarWash',
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      },
      redirect_uri: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/google`,
      profile(profile) {
        return {
          id: profile.sub,
          _id: new ObjectId().toString(), // Ensure we have a valid _id
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'user',
          emailVerified: new Date(),
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
          
          // Input validation
          if (!credentials?.email?.trim() || !credentials?.password) {
            console.error('Missing credentials');
            throw new Error('Please provide both email and password');
          }
          
          const email = credentials.email.trim().toLowerCase();
          console.log('Auth attempt for email:', email);
          
          // Case-insensitive email search with proper error handling
          const user = await User.findOne({ 
            email: { $regex: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
          }).select('+password').lean();
          
          if (!user) {
            console.error('No user found for email:', email);
            throw new Error('Invalid email or password');
          }
          
          console.log('User found, verifying password...');
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            console.error('Invalid password for user:', email);
            throw new Error('Invalid email or password');
          }
          
          console.log('Authentication successful for user:', email);
          
          // Return user object with ID and required fields
          return {
            id: user._id.toString(),
            _id: user._id.toString(),
            name: user.name,
            email: user.email.toLowerCase(), // Ensure email is always lowercase
            role: user.role || 'user',
            image: user.image
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
    jwt: async ({ token, user, account }) => {
      // Add user ID and role to the token when user signs in
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      }
      
      // Store provider info for OAuth users
      if (account) {
        token.provider = account.provider;
      }
      
      return token;
    },
    session: async ({ session, token }) => {
      // Add user ID, role, and provider to the session
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.provider = token.provider;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Allow OAuth sign-ins
      if (account?.provider === 'google') {
        try {
          await dbConnect();
          
          // Check if user exists
          const existingUser = await User.findOne({ 
            email: { $regex: new RegExp(`^${user.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
          });
          
          // If user doesn't exist, create one
          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email.toLowerCase(),
              image: user.image,
              emailVerified: new Date(),
              role: 'user',
              // OAuth users don't have passwords
              password: crypto.randomBytes(32).toString('hex'),
            });
          }
          
          return true;
        } catch (error) {
          console.error('Error during Google sign in:', error);
          return false;
        }
      }
      
      return true;
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