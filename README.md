# Kudu - Next.js App with Supabase

A modern Next.js application with Supabase authentication and database integration, ready for deployment on Vercel.

## 🚀 Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Supabase** for authentication and database
- **JWT** token-based authentication
- **Vercel** deployment ready

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account
- A Vercel account (for deployment)

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/pminajevas/Kudu.git
cd Kudu
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Go to Settings > API in your Supabase dashboard
4. Copy your Project URL and API keys

### 3. Run Database Schema

1. In your Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the query to create tables and functions

### 4. Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   JWT_SECRET=your_random_jwt_secret_here
   ```

3. Generate a secure JWT secret:

   ```bash
   # On Linux/Mac
   openssl rand -hex 64

   # Or use any random string generator
   ```

### 5. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your app.

### 6. Test the Database

Visit [http://localhost:3000/test-db](http://localhost:3000/test-db) to test:

- User registration
- User login
- Viewing user profiles
- JWT token authentication

## 🚀 Deployment on Vercel

### 1. Connect to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Vercel will automatically detect it's a Next.js project

### 2. Set Environment Variables in Vercel

In your Vercel project settings, add these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon public key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `JWT_SECRET` - Your JWT secret key

### 3. Deploy

Vercel will automatically deploy your app. Future pushes to your main branch will trigger new deployments.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts     # Login endpoint
│   │   │   └── register/route.ts  # Registration endpoint
│   │   └── users/route.ts         # User management
│   ├── test-db/page.tsx          # Database test page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── hooks/
│   └── useAuth.tsx               # Authentication hook
├── lib/
│   ├── auth.ts                   # Auth utilities
│   └── supabase.ts              # Supabase client
└── middleware.ts                 # Auth middleware
```

## 🔐 Authentication Flow

1. **Registration**: Users sign up with email/password
2. **Supabase Auth**: Creates user in Supabase Auth
3. **Profile Creation**: Trigger automatically creates user profile
4. **JWT Token**: Server generates JWT for session management
5. **Protected Routes**: Middleware validates JWT tokens

## 📊 Database Schema

### `profiles` table:

- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `name` (Text)
- `avatar_url` (Text, Optional)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Row Level Security (RLS):

- Users can only view/edit their own profiles
- Automatic profile creation on user signup

## 🛡️ Security Features

- **Row Level Security** (RLS) enabled
- **JWT token authentication**
- **Password hashing** with bcrypt
- **Environment variable protection**
- **CORS protection**

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
