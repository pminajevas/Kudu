import NextAuth, { Session } from "next-auth"
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from "next-auth/providers/google"
import { SupabaseAdapter } from "@auth/supabase-adapter"
import { supabaseAdmin } from "@/lib/supabase"
import { getOrCreateUserProfile } from "@/lib/auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  callbacks: {
    async session({ session, token, user }: { session: Session; token: any; user: any }) {
      // Send properties to the client
      if (session.user) {
        session.user.id = user.id
        
        // Ensure OAuth users have profiles
        if (user && user.id) {
          try {
            await getOrCreateUserProfile(
              user.id,
              user.name || user.email?.split('@')[0] || 'User',
              user.image || undefined
            );
          } catch (error) {
            console.error('Error ensuring OAuth user profile exists:', error);
            // Don't block session, just log the error
          }
        }
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
