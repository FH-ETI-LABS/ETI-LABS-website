/**
 * StaffTable.tsx
 * -----------------
 * A React + TypeScript component that displays a table of lab staff.
 * The table is grouped by research area (e.g., "Molecular Biology", "Genetics").
 * Currently, the table is empty but ready to accept dynamic data.
 *
 * Styling is defined separately in `StaffTable.css`.
 */

import React from "react";
import "./LabStaffPage.css";

/**
 * Interface defining the structure of a single staff member.
 * Updated to match ETI Dashboard requirements
 */
interface StaffMember {
  firstName: string;
  lastName: string;
  jobTitle: string; // official HR position
  role: string; // what does this person do
  labAssigned: string;
  communities: {
    fws: boolean; // Federal Work Study
    mesa: boolean;
    umoja: boolean;
    puente: boolean;
    veteran: boolean;
  };
  email: string;
  telephone: string;
  cwid: number;
}

/**
 * StaffTable Component
 *
 * This component renders:
 * - A styled container with a title.
 * - A table with three columns: Name, Role, and Group.
 * - Placeholder message if no data is available.
 *
 * Future Enhancements:
 * - Populate data dynamically (from API or local state).
 * - Add sorting, filtering, or pagination.
 * - Connect to a form for adding new staff members.
 */
const StaffTable = () => {
  // sample staff data
  const staffData: StaffMember[] = [
    {
      firstName: "Emma",
      lastName: "Wilson",
      jobTitle: "Laboratory Director",
      role: "Oversees lab operations and research direction",
      labAssigned: "Molecular Biology",
      communities: {
        fws: false,
        mesa: true,
        umoja: false,
        puente: false,
        veteran: false,
      },
      email: "ewilson@example.edu",
      telephone: "555-0101",
      cwid: 1001,
    },
    {
      firstName: "John",
      lastName: "Smith",
      jobTitle: "Research Scientist",
      role: "Conducts molecular biology experiments",
      labAssigned: "Molecular Biology",
      communities: {
        fws: true,
        mesa: false,
        umoja: false,
        puente: false,
        veteran: false,
      },
      email: "jsmith@example.edu",
      telephone: "555-0102",
      cwid: 1002,
    },
    {
      firstName: "Sophia",
      lastName: "Patel",
      jobTitle: "Postdoctoral Researcher",
      role: "Genetics research and data analysis",
      labAssigned: "Genetics",
      communities: {
        fws: false,
        mesa: false,
        umoja: true,
        puente: false,
        veteran: false,
      },
      email: "spatel@example.edu",
      telephone: "555-0103",
      cwid: 1003,
    },
  ];

  //Staff sorting algorithm by lab assignment
  const groupedStaff = staffData.reduce<Record<string, StaffMember[]>>(
    (acc, member) => {
      if (!acc[member.labAssigned]) acc[member.labAssigned] = [];
      acc[member.labAssigned].push(member);
      return acc;
    },
    {}
  );

  // Helper function to format communities
  const formatCommunities = (communities: StaffMember['communities']): string => {
    const active = [];
    if (communities.fws) active.push('FWS');
    if (communities.mesa) active.push('Mesa');
    if (communities.umoja) active.push('Umoja');
    if (communities.puente) active.push('Puente');
    if (communities.veteran) active.push('Veteran');
    return active.length > 0 ? active.join(', ') : 'None';
  };

  return (
    <div className="staff-table-container">
      <h2 className="staff-table-title">Lab Staff</h2>

      <table className="staff-table">
        <thead>
          <tr className="staff-table-header">
            <th>Name</th>
            <th>Job Title</th>
            <th>Role</th>
            <th>Lab</th>
            <th>Communities</th>
            <th>Email</th>
            <th>Phone</th>
            <th>CWID</th>
          </tr>
        </thead>

        <tbody>
          {/* If there are no staff entries, display a friendly placeholder */}
          {
            // Otherwise, render grouped staff entries
            Object.entries(groupedStaff).map(([group, members]) => (
              <React.Fragment key={group}>
                {/* Lab assignment row */}
                <tr>
                  <td colSpan={8} className="group-row">
                    {group}
                  </td>
                </tr>

                {/* Each staff member in this lab */}
                {members.map((member) => (
                  <tr key={member.cwid} className="staff-row">
                    <td>{member.firstName} {member.lastName}</td>
                    <td>{member.jobTitle}</td>
                    <td>{member.role}</td>
                    <td>{member.labAssigned}</td>
                    <td>{formatCommunities(member.communities)}</td>
                    <td>{member.email}</td>
                    <td>{member.telephone}</td>
                    <td>{member.cwid}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;
