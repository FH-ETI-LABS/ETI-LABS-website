import "./DashboardPage.css";

interface EquipmentPageProps {
  onNavigate?: (page: string) => void;
}

const EquipmentPage = ({ onNavigate }: EquipmentPageProps) => {
  return (
    <div className="dashboard-container">
      <div className="header-bar">
        <div className="header-left">
          <h2>Equipment</h2>
        </div>
      </div>

      <div className="dashboard-layout">
        <aside className="sidebar">
          <button onClick={() => onNavigate?.("dashboard")}>
            ← Back to Dashboard
          </button>
        </aside>

        <main className="main-content">
          <h1 className="page-title">Equipment</h1>

          <div className="content-card">
            <strong>Camera A</strong>
            <p>Status: Available</p>
          </div>

          <div className="content-card">
            <strong>Sensor Kit</strong>
            <p>Status: In Use</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EquipmentPage;
