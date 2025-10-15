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
 */
interface StaffMember {
  name: string;
  role: string;
  group: string;
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
      name: "Dr. Emma Wilson",
      role: "Lab Director",
      group: "Molecular Biology",
    },
    {
      name: "Dr. John Smith",
      role: "Research Scientist",
      group: "Molecular Biology",
    },
    {
      name: "Dr. Sophia Patel",
      role: "Postdoctoral Researcher",
      group: "Genetics",
    },
    { name: "Dr. Michael Lee", role: "Lab Technician", group: "Genetics" },
    {
      name: "Dr. Emily Brown",
      role: "Research Scientist",
      group: "Neurobiology",
    },
    {
      name: "Dr. David Jones",
      role: "Postdoctoral Researcher",
      group: "Neurobiology",
    },
    {
      name: "Dr. Laura Garcia",
      role: "Research Scientist",
      group: "Bioinformatics",
    },
  ];

  //Staff sorting algorithm by type of group
  const groupedStaff = staffData.reduce<Record<string, StaffMember[]>>(
    (acc, member) => {
      if (!acc[member.group]) acc[member.group] = [];
      acc[member.group].push(member);
      return acc;
    },
    {}
  );

  return (
    <div className="staff-table-container">
      <h2 className="staff-table-title">Lab Staff</h2>

      <table className="staff-table">
        <thead>
          <tr className="staff-table-header">
            <th>Name</th>
            <th>Role</th>
            <th>Group</th>
          </tr>
        </thead>

        <tbody>
          {/* If there are no staff entries, display a friendly placeholder */}
          {
            // Otherwise, render grouped staff entries
            Object.entries(groupedStaff).map(([group, members]) => (
              <React.Fragment key={group}>
                {/* Group name row */}
                <tr>
                  <td colSpan={3} className="group-row">
                    {group}
                  </td>
                </tr>

                {/* Each staff member in this group */}
                {members.map((member) => (
                  <tr key={member.name} className="staff-row">
                    <td>{member.name}</td>
                    <td>{member.role}</td>
                    <td>{member.group}</td>
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
