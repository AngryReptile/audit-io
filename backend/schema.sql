-- Create the database if it doesn't exist
-- CREATE DATABASE ai_code_review;

-- Table for user management (Google Auth)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    google_id TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'user', -- 'user' or 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table to store AI reviews
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    code_input TEXT NOT NULL,
    language TEXT,
    github_url TEXT,
    score INTEGER CHECK (score >= 0 AND score <= 10),
    bugs JSONB, -- Stores the bug list: [{ severity, description, line }]
    suggestions JSONB, -- Stores improvements: [{ before, after, description }]
    documentation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
