/**
 * StemClubsPage.tsx
 * -------------------
 * Admin page for managing STEM clubs.
 * - Displays an "Add New Club" button
 * - Loads the StemClubsTable component with a list of clubs
 *
 * Future enhancements:
 *  - Add modal or form for adding a new club
 *  - Fetch clubs from an API instead of hardcoded data
 */

import React, { useState } from "react";
import StemClubsTable from "../Components/StemClubsTable/StemClubsTable";
import type { Club } from "../Components/StemClubsTable/StemClubsTable";
import "../Components/StemClubsTable/StemClubsTable.css";

/**
 * StemClubsPage Component
 * Handles the page-level state and renders the StemClubsTable.
 */
const StemClubsPage = () => {
  // sample club data
  const [clubs] = useState<Club[]>([
    {
      id: 1,
      name: "Robotics Club",
      president: "Alice Smith",
      advisor: "Mr. Johnson",
      imageUrl: "../assets/images/ETILOGO.png",
      meetingTime: "Fridays 3 PM",
    },
    {
      id: 2,
      name: "Math Club",
      president: "Bob Lee",
      advisor: "Ms. Parker",
      imageUrl: "../assets/images/ETILOGO.png",
      meetingTime: "Tuesdays 4 PM",
    },
  ]);

  return (
    <div className="stem-clubs-container">
      {/* Add New Club button */}
      <button className="add-club-button">Add New Club</button>

      {/* Table displaying all clubs */}
      <StemClubsTable clubs={clubs} />
    </div>
  );
};

export default StemClubsPage;
