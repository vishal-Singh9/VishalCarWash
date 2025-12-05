import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import dbConnect from '@/lib/db';

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: 'carwash',
  }),
  providers: [
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
          
          // Check if password is correct
          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            throw new Error('Invalid password');
          }
          
          // Return user object without password
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || 'user',
          };
        } catch (error) {
          console.error('Authorization error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
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
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-for-development',
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
