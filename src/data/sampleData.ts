import type { Project } from "../Components/ProjectCard/ProjectCard";
import type { Club } from "../Components/StemClubsTable/StemClubsTable";

export const sampleProject: Project = {
  name: "Example Project",
  briefDescription: "A short project description.",
  lab: "ai",
  principalInvestigator: "Dr. Example",
  advisor: "Advisor Name",
  completion: 42,
  estTime: "4 weeks",
  events: {
    rsls: false,
    berkeleySymposium: false,
    googleCaseComp: false,
    foothillInnovationChallenge: false,
  },
};

export const sampleCameras = [
  { id: "camera-1", title: "Lab Camera" },
];

export const sampleClubs: Club[] = [];
