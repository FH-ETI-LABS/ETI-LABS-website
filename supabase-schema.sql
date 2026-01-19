-- ETI Labs Database Schema
-- This file contains the SQL commands to create all necessary tables in Supabase
-- Run this in the Supabase SQL Editor to set up your database

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STAFF TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS staff (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID UNIQUE REFERENCES auth.users(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    job_title VARCHAR(200) NOT NULL,
    role TEXT NOT NULL,
    lab_assigned VARCHAR(200) NOT NULL,
    community_fws BOOLEAN DEFAULT FALSE,
    community_mesa BOOLEAN DEFAULT FALSE,
    community_umoja BOOLEAN DEFAULT FALSE,
    community_puente BOOLEAN DEFAULT FALSE,
    community_veteran BOOLEAN DEFAULT FALSE,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(20),
    cwid INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index on email and cwid for faster lookups
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_cwid ON staff(cwid);
CREATE INDEX IF NOT EXISTS idx_staff_lab ON staff(lab_assigned);
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON staff(user_id);

-- ============================================
-- STEM CLUBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS stem_clubs (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    president VARCHAR(200) NOT NULL,
    advisor VARCHAR(200) NOT NULL,
    meeting_time VARCHAR(200),
    location VARCHAR(200),
    description TEXT,
    discord_link VARCHAR(500),
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index on club name
CREATE INDEX IF NOT EXISTS idx_stem_clubs_name ON stem_clubs(name);

-- ============================================
-- LAB PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lab_projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    brief_description TEXT,
    lab VARCHAR(200) NOT NULL,
    principal_investigator VARCHAR(200) NOT NULL,
    advisor VARCHAR(200),
    completion INTEGER DEFAULT 0 CHECK (completion >= 0 AND completion <= 100),
    est_time VARCHAR(100),
    event_rsls BOOLEAN DEFAULT FALSE,
    event_berkeley_symposium BOOLEAN DEFAULT FALSE,
    event_google_case_comp BOOLEAN DEFAULT FALSE,
    event_foothill_innovation_challenge BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes on lab and completion
CREATE INDEX IF NOT EXISTS idx_lab_projects_lab ON lab_projects(lab);
CREATE INDEX IF NOT EXISTS idx_lab_projects_completion ON lab_projects(completion);

-- ============================================
-- LAB EQUIPMENT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lab_equipment (
    id BIGSERIAL PRIMARY KEY,
    resource_name VARCHAR(300) NOT NULL,
    resource_description TEXT,
    lab VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index on lab
CREATE INDEX IF NOT EXISTS idx_lab_equipment_lab ON lab_equipment(lab);

-- ============================================
-- LAB SIGNUPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS lab_signups (
    id BIGSERIAL PRIMARY KEY,
    time_signed_in VARCHAR(50) NOT NULL,
    time_signed_out VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    lab VARCHAR(200) NOT NULL,
    cwid INTEGER NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_lab_signups_date ON lab_signups(date);
CREATE INDEX IF NOT EXISTS idx_lab_signups_cwid ON lab_signups(cwid);
CREATE INDEX IF NOT EXISTS idx_lab_signups_lab ON lab_signups(lab);

-- ============================================
-- ANNOUNCEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS announcements (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add index on created_at for efficient ordering
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables for security

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE stem_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================
-- These policies allow read access to authenticated users
-- Adjust these based on your security requirements

-- Staff table policies
DROP POLICY IF EXISTS "Allow read access to staff" ON staff;
DROP POLICY IF EXISTS "Allow insert access to staff" ON staff;
DROP POLICY IF EXISTS "Allow update access to staff" ON staff;
DROP POLICY IF EXISTS "Allow delete access to staff" ON staff;
DROP POLICY IF EXISTS "Allow self insert access to staff" ON staff;
DROP POLICY IF EXISTS "Allow bootstrap admin insert access to staff" ON staff;
DROP POLICY IF EXISTS "Allow bootstrap admin update access to staff" ON staff;

CREATE POLICY "Allow read access to staff" ON staff
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admin insert access to staff" ON staff
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.user_id = auth.uid()
              AND s.role = 'admin'
        )
    );

CREATE POLICY "Allow self insert access to staff" ON staff
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated'
        AND user_id = auth.uid()
        AND role <> 'admin'
    );

CREATE POLICY "Allow bootstrap admin insert access to staff" ON staff
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated'
        AND user_id = auth.uid()
        AND role = 'admin'
        AND NOT EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.role = 'admin'
        )
    );

CREATE POLICY "Allow admin update access to staff" ON staff
    FOR UPDATE USING (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.user_id = auth.uid()
              AND s.role = 'admin'
        )
    );

CREATE POLICY "Allow bootstrap admin update access to staff" ON staff
    FOR UPDATE
    USING (
        auth.role() = 'authenticated'
        AND user_id = auth.uid()
        AND NOT EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.role = 'admin'
        )
    )
    WITH CHECK (
        auth.role() = 'authenticated'
        AND user_id = auth.uid()
        AND role = 'admin'
    );

CREATE POLICY "Allow admin delete access to staff" ON staff
    FOR DELETE USING (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.user_id = auth.uid()
              AND s.role = 'admin'
        )
    );

-- STEM Clubs table policies
CREATE POLICY "Allow read access to stem_clubs" ON stem_clubs
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert access to stem_clubs" ON stem_clubs;
DROP POLICY IF EXISTS "Allow update access to stem_clubs" ON stem_clubs;
DROP POLICY IF EXISTS "Allow delete access to stem_clubs" ON stem_clubs;
DROP POLICY IF EXISTS "Allow admin delete access to stem_clubs" ON stem_clubs;

CREATE POLICY "Allow insert access to stem_clubs" ON stem_clubs
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.user_id = auth.uid()
              AND s.role = 'admin'
        )
    );

CREATE POLICY "Allow update access to stem_clubs" ON stem_clubs
    FOR UPDATE USING (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.user_id = auth.uid()
              AND s.role = 'admin'
        )
    );

CREATE POLICY "Allow delete access to stem_clubs" ON stem_clubs
    FOR DELETE USING (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.user_id = auth.uid()
              AND s.role = 'admin'
        )
    );

-- Lab Projects table policies
CREATE POLICY "Allow read access to lab_projects" ON lab_projects
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert access to lab_projects" ON lab_projects;
DROP POLICY IF EXISTS "Allow update access to lab_projects" ON lab_projects;
DROP POLICY IF EXISTS "Allow delete access to lab_projects" ON lab_projects;

CREATE POLICY "Allow insert access to lab_projects" ON lab_projects
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.user_id = auth.uid()
              AND s.role = 'admin'
        )
    );

CREATE POLICY "Allow update access to lab_projects" ON lab_projects
    FOR UPDATE USING (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.user_id = auth.uid()
              AND s.role = 'admin'
        )
    );

CREATE POLICY "Allow delete access to lab_projects" ON lab_projects
    FOR DELETE USING (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.user_id = auth.uid()
              AND s.role = 'admin'
        )
    );

-- Lab Equipment table policies
CREATE POLICY "Allow read access to lab_equipment" ON lab_equipment
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert access to lab_equipment" ON lab_equipment;
DROP POLICY IF EXISTS "Allow update access to lab_equipment" ON lab_equipment;
DROP POLICY IF EXISTS "Allow delete access to lab_equipment" ON lab_equipment;

CREATE POLICY "Allow insert access to lab_equipment" ON lab_equipment
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.user_id = auth.uid()
              AND s.role = 'admin'
        )
    );

CREATE POLICY "Allow update access to lab_equipment" ON lab_equipment
    FOR UPDATE USING (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.user_id = auth.uid()
              AND s.role = 'admin'
        )
    );

CREATE POLICY "Allow delete access to lab_equipment" ON lab_equipment
    FOR DELETE USING (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.user_id = auth.uid()
              AND s.role = 'admin'
        )
    );

-- Lab Signups table policies
CREATE POLICY "Allow read access to lab_signups" ON lab_signups
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow insert access to lab_signups" ON lab_signups;
DROP POLICY IF EXISTS "Allow update access to lab_signups" ON lab_signups;
DROP POLICY IF EXISTS "Allow delete access to lab_signups" ON lab_signups;

CREATE POLICY "Allow insert access to lab_signups" ON lab_signups
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.user_id = auth.uid()
              AND s.role = 'admin'
        )
    );

CREATE POLICY "Allow update access to lab_signups" ON lab_signups
    FOR UPDATE USING (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.user_id = auth.uid()
              AND s.role = 'admin'
        )
    );

CREATE POLICY "Allow delete access to lab_signups" ON lab_signups
    FOR DELETE USING (
        auth.role() = 'authenticated'
        AND EXISTS (
            SELECT 1
            FROM staff s
            WHERE s.user_id = auth.uid()
              AND s.role = 'admin'
        )
    );

-- Announcements table policies
CREATE POLICY "Allow read access to announcements" ON announcements
    FOR SELECT USING (true);

CREATE POLICY "Allow insert access to announcements" ON announcements
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow delete access to announcements" ON announcements
    FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all tables with updated_at column
CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stem_clubs_updated_at BEFORE UPDATE ON stem_clubs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lab_projects_updated_at BEFORE UPDATE ON lab_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lab_equipment_updated_at BEFORE UPDATE ON lab_equipment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment to insert sample data

/*
INSERT INTO staff (first_name, last_name, job_title, role, lab_assigned, community_mesa, email, telephone, cwid) VALUES
    ('Emma', 'Wilson', 'Laboratory Director', 'Oversees lab operations', 'Engineering Lab', true, 'ewilson@example.edu', '555-0101', 1001),
    ('John', 'Smith', 'Research Scientist', 'Conducts research', 'Computer Science Lab', false, 'jsmith@example.edu', '555-0102', 1002);

INSERT INTO stem_clubs (name, president, advisor, meeting_time, location, description) VALUES
    ('Robotics Club', 'Alice Smith', 'Mr. Johnson', 'Fridays 3 PM', 'Room 204', 'Build and program robots'),
    ('Math Club', 'Bob Lee', 'Ms. Parker', 'Tuesdays 4 PM', 'Room 108', 'Explore advanced mathematics');
*/
