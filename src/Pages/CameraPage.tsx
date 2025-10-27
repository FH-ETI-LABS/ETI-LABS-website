/**
 * CameraPage.tsx
 * Two live camera panels for Foothill ETI Labs security dashboard.
 */

import React from "react";
import CameraCard from "../Components/CameraCard/CameraCard.tsx";
import "./CameraPage.css";

const CameraPage = () => {
  return (
    <div className="security-page">
      <header className="security-header">
        <h1>Name of Lab Here</h1>
      </header>

      <main className="security-grid">
        <CameraCard id="cam-1" title="Camera 1" />
        <CameraCard id="cam-2" title="Camera 2" />
      </main>
    </div>
  );
};

export default CameraPage;
