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
