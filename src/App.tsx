import HomePage from "./Pages/HomePage";
import LabProjectsPage from "./Pages/LabProjectsPage";
import StemClubsPage from "./Pages/StemClubsPage";
import StaffTable from "./Pages/LabStaffPage";
import CameraPage from "./Pages/CameraPage.tsx";
import LabMetricsPage from "./Pages/LabMetricsPage";
import LabEquipmentPage from "./Pages/LabEquipmentPage";
import LabSignupsPage from "./Pages/LabSignupsPage";

function App() {
  return (
    <div>
      {/* Display the new Lab Metrics Dashboard */}
      <LabMetricsPage />
      
      {/* Uncomment any of these to see other pages: */}
      {/* <StaffTable /> */}
      {/* <StemClubsPage /> */}
      {/* <LabProjectsPage /> */}
      {/* <LabEquipmentPage /> */}
      {/* <LabSignupsPage /> */}
      {/* <CameraPage /> */}
    </div>
  );
}

export default App;
