/**
 * LabEquipmentPage.tsx
 * ---------------------
 * Page component for managing lab equipment inventory.
 * Displays a list of equipment/resources available in the lab.
 */

import React, { useState } from "react";
import "./LabEquipmentPage.css";

/**
 * Interface defining the structure of lab equipment/resource
 */
export interface Equipment {
  id: number;
  resourceName: string;
  resourceDescription: string;
  lab: string; // Which lab this equipment belongs to
}

/**
 * LabEquipmentPage Component
 * Displays all lab equipment in a table format
 */
const LabEquipmentPage = () => {
  // Sample equipment data
  const [equipment] = useState<Equipment[]>([
    {
      id: 1,
      resourceName: "3D Printer - Ultimaker S5",
      resourceDescription: "High-precision 3D printer for prototyping and manufacturing",
      lab: "Engineering Lab",
    },
    {
      id: 2,
      resourceName: "Oscilloscope - Tektronix TBS2000",
      resourceDescription: "Digital oscilloscope for circuit analysis and testing",
      lab: "Electronics Lab",
    },
    {
      id: 3,
      resourceName: "Arduino Starter Kit",
      resourceDescription: "Complete kit with Arduino Uno, sensors, and components",
      lab: "Robotics Lab",
    },
    {
      id: 4,
      resourceName: "VR Headset - Meta Quest 3",
      resourceDescription: "Virtual reality headset for immersive learning experiences",
      lab: "Computer Science Lab",
    },
    {
      id: 5,
      resourceName: "Microscope - Olympus CX23",
      resourceDescription: "Professional microscope for biological research",
      lab: "Biology Lab",
    },
  ]);

  // Group equipment by lab
  const groupedEquipment = equipment.reduce<Record<string, Equipment[]>>(
    (acc, item) => {
      if (!acc[item.lab]) acc[item.lab] = [];
      acc[item.lab].push(item);
      return acc;
    },
    {}
  );

  return (
    <div className="lab-equipment-container">
      <div className="header">
        <h1 className="page-title">Lab Equipment</h1>
        <button className="add-equipment-button">Add Equipment</button>
      </div>

      <div className="equipment-table-wrapper">
        <table className="equipment-table">
          <thead>
            <tr className="equipment-table-header">
              <th>Resource Name</th>
              <th>Description</th>
              <th>Lab</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedEquipment).map(([lab, items]) => (
              <React.Fragment key={lab}>
                {/* Lab name row */}
                <tr>
                  <td colSpan={3} className="lab-group-row">
                    {lab}
                  </td>
                </tr>

                {/* Each equipment item in this lab */}
                {items.map((item) => (
                  <tr key={item.id} className="equipment-row">
                    <td className="resource-name">{item.resourceName}</td>
                    <td className="resource-description">{item.resourceDescription}</td>
                    <td>{item.lab}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabEquipmentPage;
