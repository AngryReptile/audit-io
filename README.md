<div align="center">

<h1>⚡ Audit.io</h1>
<p><strong>AI-Powered Code Review Platform</strong></p>

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Google_Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p><em>Submit your code. Get an intelligent, structured review powered by Google Gemini AI — instantly.</em></p>

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Code Analysis** | Powered by Google Gemini (with automatic model fallback: `gemini-2.0-flash` → `gemini-2.5-flash` → `gemini-2.5-pro`) |
| 🐛 **Bug Detection** | Identifies bugs with severity ratings (Low / Medium / High) and precise line numbers |
| 💡 **Smart Suggestions** | Side-by-side before/after code improvement diffs |
| 📊 **Quality Scoring** | Every review gets a 1–10 quality score |
| 📝 **Auto Documentation** | AI generates a high-level summary for every code snippet |
| 🔍 **Language Detection** | Automatically identifies the programming language |
| 🗂️ **Repo Browser** | Browse and audit any public GitHub repository file-by-file |
| 📜 **Audit History** | Full personal review history with search and filtering |
| 👤 **Google OAuth** | Secure, one-click sign-in with Google |
| 🛡️ **Admin Panel** | Platform-wide stats, user management, and recent review monitoring |
| 🌓 **Dark / Light Mode** | Persistent theme toggle (Crystal / Luminous) |
| 📱 **Responsive Design** | Fully optimized for desktop and mobile |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite 8** — lightning-fast dev server and bundler
- **Tailwind CSS v4** — utility-first styling
- **Framer Motion** — fluid page transitions and micro-animations
- **React Router v7** — client-side routing with lazy-loaded routes
- **Lucide React** — icon library
- **React Diff Viewer** — side-by-side code diff rendering
- **React Syntax Highlighter** — beautiful code display
- **`@react-oauth/google`** — Google OAuth integration

### Backend
- **Node.js** with **Express** and **TypeScript**
- **Google Gemini API** (`@google/generative-ai`) — AI analysis engine
- **Google Auth Library** — server-side OAuth token verification
- **PostgreSQL** (via Supabase) — persistent data storage
- **`node-postgres` (pg)** — database client

### Infrastructure
- **Supabase** — hosted PostgreSQL with Row-Level Security (RLS)
- **Vercel** — monorepo deployment (frontend + backend as serverless functions)

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- npm `v9+`
- A [Supabase](https://supabase.com) project with a PostgreSQL database
- A [Google Cloud](https://console.cloud.google.com) project with OAuth 2.0 credentials
- A [Google AI Studio](https://aistudio.google.com) API key for Gemini

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/audit-io.git
cd audit-io
```

### 2. Install Dependencies

```bash
npm install
```

This installs dependencies for both the `frontend` and `backend` workspaces.

### 3. Set Up the Database

Run the SQL schema against your Supabase database:

```bash
# Connect to your Supabase project's SQL editor and run:
psql -h <your-supabase-host> -U postgres -d postgres -f backend/schema.sql
```

Or paste the contents of `backend/schema.sql` directly into the **Supabase SQL Editor**.

### 4. Configure Environment Variables

**Backend** — create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

Then fill in your values:

```env
PORT=3001
FRONTEND_URL=http://localhost:5173

# PostgreSQL connection (from Supabase → Settings → Database)
DB_PASSWORD=your_supabase_db_password

# Google OAuth (from Google Cloud Console → APIs & Services → Credentials)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Gemini AI (from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key
```

**Frontend** — create `frontend/.env`:

```env
VITE_API_BASE=http://localhost:3001
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 5. Run Locally

Open two terminals:

```bash
# Terminal 1 — Backend
cd backend
npm run dev
```

```bash
# Terminal 2 — Frontend
cd frontend
npm run dev
```

The app will be available at **`http://localhost:5173`**.

---

## 📁 Project Structure

```
audit-io/
├── frontend/                 # React + Vite application
│   └── src/
│       ├── components/
│       │   ├── Dashboard.tsx       # Stats overview & quick actions
│       │   ├── ManualReview.tsx    # Paste-code review interface
│       │   ├── RepoReview.tsx      # GitHub repo browser + file audit
│       │   ├── HistoryView.tsx     # Personal review history
│       │   ├── AdminPanel.tsx      # Admin control center
│       │   ├── LoginView.tsx       # Google OAuth login screen
│       │   └── Skeletons.tsx       # Loading skeleton components
│       ├── context/
│       │   └── ReviewContext.tsx   # Shared review state
│       └── App.tsx                 # Root layout, routing & sidebar
│
├── backend/                  # Express + TypeScript API
│   └── src/
│       ├── server.ts               # API routes & Express setup
│       ├── ai.ts                   # Gemini AI service with fallback logic
│       └── github.ts              # GitHub REST API integration
│   ├── schema.sql                  # PostgreSQL schema
│   └── .env.example               # Environment variable reference
│
├── vercel.json               # Vercel monorepo deployment config
└── package.json              # Root workspace config
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/google` | Authenticate with a Google ID token |
| `POST` | `/api/review` | Submit code for AI analysis |
| `GET` | `/api/history/:userId` | Fetch a user's past reviews |
| `GET` | `/api/stats/:userId` | Get aggregated stats for a user |
| `POST` | `/api/github/fetch` | Fetch public GitHub repo contents |
| `POST` | `/api/github/file` | Fetch and decode a single GitHub file |
| `GET` | `/api/admin/stats` | Platform-wide statistics (admin) |
| `GET` | `/api/admin/users` | List all users with review counts (admin) |
| `GET` | `/api/admin/reviews/recent` | Get the 50 most recent reviews (admin) |

---

## 🗄️ Database Schema

```sql
-- Users table (Google OAuth)
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    google_id   TEXT UNIQUE NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    name        TEXT,
    avatar      TEXT,
    role        TEXT DEFAULT 'user',   -- 'user' | 'admin'
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Reviews table (AI analysis results)
CREATE TABLE reviews (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER REFERENCES users(id) ON DELETE CASCADE,
    code_input   TEXT NOT NULL,
    language     TEXT,
    github_url   TEXT,
    score        INTEGER CHECK (score >= 0 AND score <= 10),
    bugs         JSONB,        -- [{ severity, description, line }]
    suggestions  JSONB,        -- [{ before, after, description }]
    documentation TEXT,
    created_at   TIMESTAMPTZ DEFAULT now()
);
```

Row-Level Security (RLS) is enabled on both tables — all data access goes exclusively through the trusted backend.

---

## ☁️ Deployment (Vercel)

This project is configured as a **Vercel monorepo**.

1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Add all environment variables from both `.env` files to your Vercel project settings.
4. Vercel will automatically detect and deploy both the frontend and backend.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  <p>Built with ⚡ by <strong>Audit.io</strong></p>
</div>
