# Explorer — Modern Blogging Platform

A premium, full-stack blogging platform built with Next.js and Supabase, featuring AI-powered summaries and robust role-based access control (RBAC).

## 🚀 Live Demo
The application is designed for deployment on a VPS (Ubuntu/Nginx) and is fully responsive.

## ✨ Features
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Site-wide management, statistics, and moderation tools.
  - **Author**: Create, edit, and manage personal stories.
  - **Viewer**: Read stories, view AI summaries, and participate in discussions.
- **AI-Powered Summaries**: Automatic ~200-word summary generation for every new story using Google Generative AI (Gemini).
- **Modern Search & Pagination**: Effortlessly find and navigate through high-quality stories.
- **Dynamic Dashboards**: Custom-tailored experiences for every user role.
- **Clean Aesthetics**: A minimal, typography-focused design system.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS (Design Tokens).
- **Backend/Database**: Supabase (PostgreSQL), Row Level Security (RLS).
- **AI**: Google Generative AI SDK (Gemini 2.0 Flash).
- **Auth**: Supabase Auth (Email/Password).

## 📦 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/YourUsername/BloggingPlatform.git
cd BloggingPlatform/client
```

### 2. Environment Variables
Create a `.env` file in the `client` directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_AI_API_KEY=your_google_gemini_api_key
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup
Run the SQL migrations found in `supabase/migrations/001_rls_policies.sql` in your Supabase SQL Editor to set up tables and RLS policies.

### 5. Start Development
```bash
npm run dev
```

## 🌐 Deployment Steps (VPS)
1. **Prepare Server**: Ubuntu 22.04+ with Node.js and Nginx installed.
2. **Setup PM2**: `npm install -g pm2`
3. **Build App**: `npm run build`
4. **Start App**: `pm2 start npm --name "blog-platform" -- start`
5. **Nginx Config**: Configure a reverse proxy to `http://localhost:3000`.

---
*Built for the Advanced Web Development Assignment.*
