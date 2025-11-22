/**
 * supabase.ts
 * -----------
 * Supabase client configuration for the ETI Labs application.
 * Handles connection to Supabase backend for authentication and data access.
 */

import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase environment variables are not set. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

/**
 * Supabase client instance
 * Used throughout the application for database operations
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

/**
 * Database table names
 * Centralized reference for all table names in the database
 */
export const TABLES = {
  STAFF: 'staff',
  STEM_CLUBS: 'stem_clubs',
  LAB_PROJECTS: 'lab_projects',
  LAB_EQUIPMENT: 'lab_equipment',
  LAB_SIGNUPS: 'lab_signups',
  ANNOUNCEMENTS: 'announcements',
} as const;

/**
 * Type definitions for database tables
 * These should match the Supabase schema
 */

// Staff table type
export interface StaffRow {
  id: number;
  first_name: string;
  last_name: string;
  job_title: string;
  role: string;
  lab_assigned: string;
  community_fws: boolean;
  community_mesa: boolean;
  community_umoja: boolean;
  community_puente: boolean;
  community_veteran: boolean;
  email: string;
  telephone: string;
  cwid: number;
  created_at?: string;
  updated_at?: string;
}

// STEM Clubs table type
export interface StemClubRow {
  id: number;
  name: string;
  president: string;
  advisor: string;
  meeting_time: string;
  location: string;
  description: string;
  discord_link?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Lab Projects table type
export interface LabProjectRow {
  id: number;
  name: string;
  brief_description: string;
  lab: string;
  principal_investigator: string;
  advisor: string;
  completion: number;
  est_time: string;
  event_rsls: boolean;
  event_berkeley_symposium: boolean;
  event_google_case_comp: boolean;
  event_foothill_innovation_challenge: boolean;
  created_at?: string;
  updated_at?: string;
}

// Lab Equipment table type
export interface LabEquipmentRow {
  id: number;
  resource_name: string;
  resource_description: string;
  lab: string;
  created_at?: string;
  updated_at?: string;
}

// Lab Signups table type
export interface LabSignupRow {
  id: number;
  time_signed_in: string;
  time_signed_out: string;
  first_name: string;
  last_name: string;
  lab: string;
  cwid: number;
  date: string;
  created_at?: string;
}

// Announcements table type
export interface AnnouncementRow {
  id: number;
  content: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export default supabase;
