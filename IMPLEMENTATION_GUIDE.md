# ETI Dashboard Implementation Guide

This document describes the implementation of the ETI Dashboard requirements based on the specifications in `ETI Dashboard.pdf`.

## 📋 Overview

The codebase has been updated to match all requirements specified in the ETI Dashboard PDF. This includes:

1. ✅ Staff table with complete information
2. ✅ STEM Clubs with all required fields
3. ✅ Lab Projects with descriptions, advisors, and events
4. ✅ Lab Equipment inventory system
5. ✅ Lab Signups tracking system
6. ✅ Lab Metrics dashboard
7. ✅ Supabase integration setup

## 🗂️ Changes Made

### 1. Staff Table (`src/Pages/LabStaffPage.tsx`)

**Updated Interface:**
- ✅ `firstName` (string)
- ✅ `lastName` (string)
- ✅ `jobTitle` (string) - Official HR position
- ✅ `role` (string) - What does this person do
- ✅ `labAssigned` (string)
- ✅ `communities` (object with boolean fields):
  - `fws` - Federal Work Study
  - `mesa`
  - `umoja`
  - `puente`
  - `veteran`
- ✅ `email` (string)
- ✅ `telephone` (string)
- ✅ `cwid` (number)

**Features:**
- Staff grouped by lab assignment
- Community participation display
- All 8 columns in table view

### 2. STEM Clubs (`src/Components/StemClubsTable/StemClubsTable.tsx`)

**Updated Interface:**
- ✅ `name` (string)
- ✅ `president` (string)
- ✅ `advisor` (string)
- ✅ `meetingTime` (string)
- ✅ `location` (string)
- ✅ `description` (string)
- ✅ `discordLink` (string, optional) - Discord link/website

**Features:**
- Card-based display
- Clickable Discord/website links
- Full club information

### 3. Lab Projects (`src/Pages/LabProjectsPage.tsx`)

**Updated Interface:**
- ✅ `name` (string)
- ✅ `briefDescription` (string)
- ✅ `principalInvestigator` (string) - Lead engineer/PI
- ✅ `advisor` (string)
- ✅ `events` (object with boolean fields):
  - `rsls` - RSLS event
  - `berkeleySymposium`
  - `googleCaseComp`
  - `foothillInnovationChallenge`

**Features:**
- Project cards with all information
- Progress tracking
- Event participation display

### 4. Lab Equipment (NEW: `src/Pages/LabEquipmentPage.tsx`)

**Interface:**
- ✅ `resourceName` (string)
- ✅ `resourceDescription` (string)
- ✅ `lab` (string) - Which lab the equipment belongs to

**Features:**
- Table view grouped by lab
- Add equipment functionality
- Equipment inventory management

### 5. Lab Signups (NEW: `src/Pages/LabSignupsPage.tsx`)

**Interface:**
- ✅ `timeSignedIn` (string)
- ✅ `timeSignedOut` (string)
- ✅ `firstName` (string)
- ✅ `lastName` (string)
- ✅ `lab` (string)
- ✅ `cwid` (number)
- ✅ `date` (string)

**Features:**
- Daily sign-in/sign-out tracking
- Grouped by date
- Summary statistics (total sign-ins, currently in lab, etc.)
- Export and manual sign-in options

### 6. Lab Metrics Dashboard (NEW: `src/Pages/LabMetricsPage.tsx`)

**Features:**
- ✅ Simplified view of all other pages
- ✅ Real-time statistics:
  - Total staff count
  - Staff distribution by lab
  - Community participation
  - STEM clubs overview
  - Active projects status
  - Equipment inventory
  - Daily lab activity
- ✅ Visual charts and progress bars
- ✅ Quick stats cards

### 7. Supabase Integration (`src/lib/supabase.ts`)

**Files Created:**
- `src/lib/supabase.ts` - Supabase client configuration
- `supabase-schema.sql` - Complete database schema
- `.env.example` - Environment variables template

**Database Tables:**
1. `staff` - Staff information with communities
2. `stem_clubs` - STEM clubs data
3. `lab_projects` - Lab projects with events
4. `lab_equipment` - Equipment inventory
5. `lab_signups` - Daily sign-in/sign-out logs

**Features:**
- Row Level Security (RLS) enabled
- Automatic `updated_at` triggers
- Indexed columns for performance
- TypeScript type definitions

## 🚀 Setup Instructions

### 1. Install Dependencies

First, you need to install the Supabase client:

```bash
npm install @supabase/supabase-js
```

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your Supabase credentials:
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to Settings > API
   - Copy your Project URL and anon/public key

3. Update `.env` with your credentials:
   ```
   VITE_SUPABASE_URL=your_actual_url
   VITE_SUPABASE_ANON_KEY=your_actual_key
   ```

### 3. Set Up Database

1. Go to your Supabase project's SQL Editor
2. Open `supabase-schema.sql`
3. Copy and paste the entire SQL schema
4. Run the SQL commands

This will create all necessary tables with:
- Proper indexes
- Row Level Security policies
- Automatic timestamp triggers

### 4. Update App.tsx to Display Pages

Currently, `App.tsx` shows only the `CameraPage`. Update it to show your desired page:

```tsx
import HomePage from "./Pages/HomePage";
import LabProjectsPage from "./Pages/LabProjectsPage";
import StemClubsPage from "./Pages/StemClubsPage";
import LabStaffPage from "./Pages/LabStaffPage";
import LabEquipmentPage from "./Pages/LabEquipmentPage";
import LabSignupsPage from "./Pages/LabSignupsPage";
import LabMetricsPage from "./Pages/LabMetricsPage";
import CameraPage from "./Pages/CameraPage";

function App() {
  return (
    <div>
      {/* Choose which page to display */}
      <LabMetricsPage />
      {/* Or add routing here */}
    </div>
  );
}

export default App;
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see your changes.

## 📁 File Structure

```
ETI-LABS-website/
├── src/
│   ├── Pages/
│   │   ├── LabStaffPage.tsx          # Updated with all staff fields
│   │   ├── LabStaffPage.css
│   │   ├── StemClubsPage.tsx         # Updated with new fields
│   │   ├── LabProjectsPage.tsx       # Updated with events & advisor
│   │   ├── LabProjectsPage.css
│   │   ├── LabEquipmentPage.tsx      # NEW - Equipment inventory
│   │   ├── LabEquipmentPage.css
│   │   ├── LabSignupsPage.tsx        # NEW - Sign-in/out tracking
│   │   ├── LabSignupsPage.css
│   │   ├── LabMetricsPage.tsx        # NEW - Dashboard
│   │   └── LabMetricsPage.css
│   ├── Components/
│   │   ├── StemClubsTable/
│   │   │   ├── StemClubsTable.tsx    # Updated interface
│   │   │   └── StemClubsTable.css
│   │   └── ProjectCard/
│   │       └── ProjectCard.tsx       # Updated display
│   └── lib/
│       └── supabase.ts               # NEW - Supabase config
├── supabase-schema.sql               # NEW - Database schema
├── .env.example                      # NEW - Environment template
└── IMPLEMENTATION_GUIDE.md           # This file
```

## 🔄 Next Steps

### For Development:

1. **Add Routing**: Implement React Router to navigate between pages
   ```bash
   npm install react-router-dom
   ```

2. **Connect to Supabase**: Replace mock data with real Supabase queries
   ```tsx
   import { supabase, TABLES } from './lib/supabase';
   
   // Example: Fetch staff data
   const { data, error } = await supabase
     .from(TABLES.STAFF)
     .select('*');
   ```

3. **Add Forms**: Create forms for adding/editing data
4. **Authentication**: Implement user login with Supabase Auth
5. **Real-time Updates**: Use Supabase subscriptions for live data

### For Production:

1. Set up proper authentication
2. Configure RLS policies based on user roles
3. Add input validation
4. Implement error handling
5. Add loading states
6. Optimize images and assets

## 📊 Data Flow

```
User Interface (Pages)
    ↓
Components (Reusable UI)
    ↓
Supabase Client (src/lib/supabase.ts)
    ↓
Supabase Database (PostgreSQL)
```

## 🔐 Security Notes

- RLS is enabled on all tables
- Anonymous users can read data
- Authenticated users can insert/update
- Adjust policies in `supabase-schema.sql` for your needs
- Never commit `.env` file to version control

## 📝 Testing the Implementation

1. **Staff Page**: Check all 8 columns display correctly with communities
2. **STEM Clubs**: Verify location, description, and links show up
3. **Projects**: Confirm description, advisor, and events display
4. **Equipment**: Test equipment list grouped by lab
5. **Signups**: Verify sign-in/out tracking with date grouping
6. **Metrics**: Check all statistics calculate correctly

## 🐛 Troubleshooting

**Issue**: TypeScript errors about missing types
- **Solution**: Install types: `npm install --save-dev @types/node`

**Issue**: Supabase client errors
- **Solution**: Check `.env` file has correct credentials

**Issue**: CSS not loading
- **Solution**: Ensure CSS imports match file names exactly

**Issue**: Pages not displaying
- **Solution**: Update `App.tsx` to import and render the desired page

## 📞 Support

For questions or issues:
1. Check this implementation guide
2. Review the PDF requirements
3. Check Supabase documentation
4. Review the code comments in each file

---

**Last Updated**: Based on ETI Dashboard.pdf requirements
**Status**: All requirements implemented ✅
