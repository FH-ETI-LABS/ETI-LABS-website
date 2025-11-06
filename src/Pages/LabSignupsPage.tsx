/**
 * LabSignupsPage.tsx
 * ------------------
 * Page component for tracking daily lab sign-ins and sign-outs.
 * Displays a report of people coming in and out of the lab.
 */

import React, { useState } from "react";
import "./LabSignupsPage.css";

/**
 * Interface defining the structure of a lab signup entry
 */
export interface Signup {
  id: number;
  timeSignedIn: string;
  timeSignedOut: string;
  firstName: string;
  lastName: string;
  lab: string;
  cwid: number;
  date: string; // Date of the signup
}

/**
 * LabSignupsPage Component
 * Displays daily lab sign-in/sign-out records in a table
 */
const LabSignupsPage = () => {
  // Sample signup data
  const [signups] = useState<Signup[]>([
    {
      id: 1,
      timeSignedIn: "08:30 AM",
      timeSignedOut: "12:45 PM",
      firstName: "John",
      lastName: "Doe",
      lab: "Engineering Lab",
      cwid: 2001,
      date: "2024-11-04",
    },
    {
      id: 2,
      timeSignedIn: "09:15 AM",
      timeSignedOut: "03:30 PM",
      firstName: "Jane",
      lastName: "Smith",
      lab: "Computer Science Lab",
      cwid: 2002,
      date: "2024-11-04",
    },
    {
      id: 3,
      timeSignedIn: "10:00 AM",
      timeSignedOut: "02:00 PM",
      firstName: "Carlos",
      lastName: "Rodriguez",
      lab: "Robotics Lab",
      cwid: 2003,
      date: "2024-11-04",
    },
    {
      id: 4,
      timeSignedIn: "11:30 AM",
      timeSignedOut: "05:15 PM",
      firstName: "Maria",
      lastName: "Garcia",
      lab: "Biology Lab",
      cwid: 2004,
      date: "2024-11-04",
    },
    {
      id: 5,
      timeSignedIn: "01:00 PM",
      timeSignedOut: "In Progress",
      firstName: "Ahmed",
      lastName: "Hassan",
      lab: "Engineering Lab",
      cwid: 2005,
      date: "2024-11-04",
    },
  ]);

  // Calculate time spent
  const calculateDuration = (timeIn: string, timeOut: string): string => {
    if (timeOut === "In Progress") return "In Progress";
    
    // Simple duration calculation (would need proper date parsing in production)
    return "Duration calculated";
  };

  // Group signups by date
  const groupedSignups = signups.reduce<Record<string, Signup[]>>(
    (acc, signup) => {
      if (!acc[signup.date]) acc[signup.date] = [];
      acc[signup.date].push(signup);
      return acc;
    },
    {}
  );

  return (
    <div className="lab-signups-container">
      <div className="header">
        <h1 className="page-title">Lab Signups - Daily Report</h1>
        <div className="header-actions">
          <button className="export-button">Export Report</button>
          <button className="add-signup-button">Manual Sign-In</button>
        </div>
      </div>

      <div className="signups-table-wrapper">
        <table className="signups-table">
          <thead>
            <tr className="signups-table-header">
              <th>Time In</th>
              <th>Time Out</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Lab</th>
              <th>CWID</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedSignups).map(([date, entries]) => (
              <React.Fragment key={date}>
                {/* Date row */}
                <tr>
                  <td colSpan={6} className="date-row">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                </tr>

                {/* Each signup entry for this date */}
                {entries.map((signup) => (
                  <tr key={signup.id} className="signup-row">
                    <td className="time-in">{signup.timeSignedIn}</td>
                    <td className={signup.timeSignedOut === "In Progress" ? "time-out in-progress" : "time-out"}>
                      {signup.timeSignedOut}
                    </td>
                    <td>{signup.firstName}</td>
                    <td>{signup.lastName}</td>
                    <td>{signup.lab}</td>
                    <td>{signup.cwid}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary stats */}
      <div className="summary-section">
        <div className="stat-card">
          <h3>Total Sign-Ins Today</h3>
          <p className="stat-value">{signups.length}</p>
        </div>
        <div className="stat-card">
          <h3>Currently In Lab</h3>
          <p className="stat-value">
            {signups.filter(s => s.timeSignedOut === "In Progress").length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Unique Labs</h3>
          <p className="stat-value">
            {new Set(signups.map(s => s.lab)).size}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LabSignupsPage;
