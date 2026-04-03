# Explorer — AI-powered Blogging Platform

Explorer is a modern, full-stack blogging platform designed for a clean reading experience and intelligent content consumption. It leverages AI to provide quick summaries, making it easier for readers to grasp the essence of long-form stories.

## Project Overview

Explorer is more than just a typical blog; it's a social space for writers and readers. Built with **Next.js**, **Supabase**, and **Google Gemini AI**, it offers a refined interface inspired by platforms like Medium and Notion. 

The platform is designed for:
- **Readers** who want a distraction-free, intelligent reading experience.
- **Authors** who want a simple but powerful editor to share their thoughts.
- **Admins** who need robust tools to moderate and manage the community.

---

## Features

### Authentication & Authorization
- **Secure Authentication**: Integrated with Supabase Auth for email/password login and signup.
- **Role-Based Access Control (RBAC)**:
  - **Viewer**: Can read posts and participate in discussions via comments.
  - **Author**: All viewer permissions and the ability to create and edit their own stories.
  - **Admin**: Full control over the platform, including post management and comment moderation.
- **Dynamic Session Management**: Real-time auth state handling via React Context.

### Content Management
- **Rich Story Editor**: Create and edit posts with support for titles, hero images, and long-form content.
- **Image Uploads**: Seamless integration with Supabase Storage for drag-and-drop cover image hosting.
- **Smart Formatting**: A custom renderer for headings, lists, blockquotes, and inline formatting.
- **Draft to Store**: Automated mapping of raw text to structured database records.

### AI-Powered Experience
- **Auto-Summarization**: Uses the **Google Gemini API** to generate concise summaries instantly upon publishing.
- **Collapsible Summary Card**: A premium UI component that provides scannable bullet points.
- **Interactive Summary Tools**:
  - **Copy**: One-click summary clip to clipboard.
  - **Listen**: Text-to-Speech (TTS) integration to listen to the summary.
  - **Share**: Native Web Share API integration.
- **Graceful Fallback**: Intelligent extraction algorithm for when AI services are unavailable.

### Social & Interaction
- **Discussion System**: Real-time comment threads on every post.
- **Admin Moderation**: Tools for administrators to remove inappropriate content.
- **Search & Discovery**: Global search with pagination to find stories by title or content.

### Design & UX
- **Medium-Inspired Typography**: High-quality serif fonts for readability.
- **Responsive Layout**: Fluid experience across mobile, tablet, and desktop.
- **Micro-Animations**: Smooth transitions, hover effects, and collapsible sections.
- **Glassmorphism**: Modern, blurred navigation bar for a premium feel.

---

## Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend-as-a-Service**: [Supabase](https://supabase.com/) (Auth, Database, Storage)
- **AI Model**: [Google Gemini 1.5 Flash](https://ai.google.dev/)
- **Database**: PostgreSQL (via Supabase) with Row Level Security (RLS)
- **Deployment**: Vercel

---


## ⚙️ Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Shriti507/BloggingPlatform.git
   cd BloggingPlatform/client
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   Create a `.env` file in the `client/` directory and add your keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_AI_API_KEY=your_gemini_api_key
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous API key.
- `GOOGLE_AI_API_KEY`: API key from Google AI Studio for Gemini summarization.

---

## Usage

### For Viewers
Start browsing stories immediately from the homepage. Create an account to participate in the comments and use the "Listen" feature for AI summaries.

### For Authors
Once logged in, click "Start Writing" in the navigation bar. You can upload a cover image, write your story, and the AI will automatically generate a summary for your readers when you hit "Publish".

### For Admins
Access the Admin Dashboard to see platform-wide statistics. Admins can moderate discussions and manage any post on the platform to maintain community standards.

---
