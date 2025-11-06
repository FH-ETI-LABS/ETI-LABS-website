import React, { useState } from "react";
import ProjectCard from "../Components/ProjectCard/ProjectCard.tsx";
import "./LabProjects.css";

export interface Project {
  id: number; //unique identifier
  name: string; //project name
  briefDescription: string; //brief description of the project
  lab: string; //the lab where the project is being conducted
  principalInvestigator: string; //lead engineer/principal investigator
  advisor: string; //project advisor
  completion: number; //completion %
  estTime: string; //time to completion
  events: {
    rsls: boolean; // RSLS event
    berkeleySymposium: boolean;
    googleCaseComp: boolean;
    foothillInnovationChallenge: boolean;
  };
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
      briefDescription: "Research into quantum entanglement for information transfer",
      lab: "Theoretical Physics Lab",
      principalInvestigator: "Dr. Anya Sharma",
      advisor: "Prof. Richard Feynman",
      completion: 65,
      estTime: "2 years",
      events: {
        rsls: true,
        berkeleySymposium: true,
        googleCaseComp: false,
        foothillInnovationChallenge: false,
      },
    },
    {
      id: 2,
      name: "AI Drug Discovery",
      briefDescription: "Using machine learning to accelerate pharmaceutical development",
      lab: "Biotech & AI Research",
      principalInvestigator: "Prof. Ben Carter",
      advisor: "Dr. Jane Watson",
      completion: 80,
      estTime: "6 months",
      events: {
        rsls: false,
        berkeleySymposium: true,
        googleCaseComp: true,
        foothillInnovationChallenge: true,
      },
    },
    {
      id: 3,
      name: "Sustainable Batteries",
      briefDescription: "Developing eco-friendly energy storage solutions",
      lab: "Materials Science Lab",
      principalInvestigator: "Dr. Chloe Chen",
      advisor: "Prof. Green Energy",
      completion: 30,
      estTime: "2 years",
      events: {
        rsls: true,
        berkeleySymposium: false,
        googleCaseComp: false,
        foothillInnovationChallenge: true,
      },
    },
    {
      id: 4,
      name: "Robotic Surgery Assist",
      briefDescription: "AI-powered robotic system for precision surgery",
      lab: "Medical Robotics Group",
      principalInvestigator: "Dr. David Kim",
      advisor: "Dr. Medical Advisor",
      completion: 95,
      estTime: "4 months",
      events: {
        rsls: false,
        berkeleySymposium: false,
        googleCaseComp: true,
        foothillInnovationChallenge: false,
      },
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
