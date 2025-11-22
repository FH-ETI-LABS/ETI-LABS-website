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


import "./StemClubsTable.css"; // Import the CSS file

// Define the Club interface for TypeScript
// Updated to match ETI Dashboard requirements
export interface Club {
  id: number; // Unique identifier for the club
  name: string; // Club name
  president: string; // Club president
  advisor: string; // Club advisor
  meetingTime: string; // Meeting time description
  location: string; // Meeting location
  description: string; // Club description
  discordLink?: string; // Discord link/website (optional)
  imageUrl: string; // Club logo/image URL
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
            <p className="club-description">{club.description}</p>
            <p className="club-president"><strong>President:</strong> {club.president}</p>
            <p className="club-advisor"><strong>Advisor:</strong> {club.advisor}</p>
            <p className="club-meeting"><strong>Meeting Time:</strong> {club.meetingTime}</p>
            <p className="club-location"><strong>Location:</strong> {club.location}</p>
            {club.discordLink && (
              <p className="club-link">
                <strong>Link:</strong>{' '}
                <a href={club.discordLink} target="_blank" rel="noopener noreferrer">
                  {club.discordLink.includes('discord') ? 'Discord' : 'Website'}
                </a>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StemClubsTable;
