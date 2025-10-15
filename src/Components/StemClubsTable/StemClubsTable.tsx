/**
 * StemClubsTable.tsx
 * -------------------
 * A reusable card component to display a list of STEM clubs.
 *
 * Props:
 * - clubs: Array of Club objects to render in the cards.
 *
 * Each card displays:
 * - Club Image
 * - Club Name
 * - President
 * - Advisor
 * - Meeting Time
 */

import React from "react";
import "./StemClubsTable.css"; // Import the CSS file

// Define the Club interface for TypeScript
export interface Club {
  id: number; // Unique identifier for the club
  name: string; // Club name
  president: string; // Club president
  advisor: string; // Club advisor
  imageUrl: string; // Club logo/image URL
  meetingTime: string; // Meeting time description
}

interface Props {
  clubs: Club[];
}

//Component that renders every stemclub card
const StemClubsTable = ({ clubs }: Props) => {
  return (
    <div className="clubs-container">
      {clubs.map((club) => (
        <div key={club.id} className="club-card">
          <img src={club.imageUrl} alt={club.name} className="club-image" />
          <div className="club-details">
            <h3 className="club-name">{club.name}</h3>
            <p className="club-president">President: {club.president}</p>
            <p className="club-advisor">Advisor: {club.advisor}</p>
            <p className="club-meeting">{club.meetingTime}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StemClubsTable;
