import React, { useState } from "react";
import ProjectCard from "../Components/ProjectCard/ProjectCard.tsx";
import "./LabProjects.css";

export interface Project {
  id: number; //unique identifier
  name: string; //project name
  lab: string; //the lab where the project is being conducted
  projectLead: string; //name of project lead
  completion: number; //completion %
  estTime: string; //time to completion
}

/**
 * LabProjectsPage Component
 * A main page component that displays a list of lab projects as a grid of cards.
 * It includes a button to add new projects.
 */
const LabProjectsPage = () => {
  //sample data
  const [projects] = useState<Project[]>([
    {
      id: 1,
      name: "Quantum Teleportation",
      lab: "Theoretical Physics Lab",
      projectLead: "Dr. Anya Sharma",
      completion: 65,
      estTime: "2 years",
    },
    {
      id: 2,
      name: "AI Drug Discovery",
      lab: "Biotech & AI Research",
      projectLead: "Prof. Ben Carter",
      completion: 80,
      estTime: "6 months",
    },
    {
      id: 3,
      name: "Sustainable Batteries",
      lab: "Materials Science Lab",
      projectLead: "Dr. Chloe Chen",
      completion: 30,
      estTime: "2 years",
    },
    {
      id: 4,
      name: "Robotic Surgery Assist",
      lab: "Medical Robotics Group",
      projectLead: "Dr. David Kim",
      completion: 95,
      estTime: "4 months",
    },
  ]);

  return (
    <div className="lab-projects-page">
      <div className="header">
        <h1 className="page-title">Lab Projects</h1>
      </div>

      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default LabProjectsPage;
