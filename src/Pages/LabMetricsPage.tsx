/**
 * LabMetricsPage.tsx
 * ------------------
 * Dashboard page showing simplified view of all lab data and statistics.
 * Provides an overview of staff, clubs, projects, equipment, and signups.
 */

import React from "react";
import "./LabMetricsPage.css";

/**
 * LabMetricsPage Component
 * Main dashboard displaying key metrics and statistics from all lab systems
 */
const LabMetricsPage = () => {
  // Mock data - in production, this would be fetched from Supabase
  const metrics = {
    staff: {
      total: 15,
      byLab: {
        "Engineering Lab": 5,
        "Computer Science Lab": 4,
        "Robotics Lab": 3,
        "Biology Lab": 3,
      },
      communities: {
        fws: 4,
        mesa: 3,
        umoja: 2,
        puente: 2,
        veteran: 1,
      },
    },
    clubs: {
      total: 8,
      activeMembers: 120,
      upcomingMeetings: 3,
    },
    projects: {
      total: 12,
      inProgress: 8,
      completed: 4,
      averageCompletion: 65,
      byLab: {
        "Engineering Lab": 4,
        "Computer Science Lab": 3,
        "Robotics Lab": 3,
        "Biology Lab": 2,
      },
    },
    equipment: {
      total: 45,
      byLab: {
        "Engineering Lab": 15,
        "Computer Science Lab": 10,
        "Robotics Lab": 12,
        "Biology Lab": 8,
      },
    },
    signups: {
      today: 23,
      currentlyInLab: 5,
      weekTotal: 127,
      mostActiveLab: "Engineering Lab",
    },
  };

  return (
    <div className="lab-metrics-container">
      <div className="metrics-header">
        <h1 className="page-title">Lab Metrics Dashboard</h1>
        <p className="subtitle">Real-time overview of ETI Labs operations</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="quick-stats">
        <div className="stat-card stat-primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Staff</h3>
            <p className="stat-number">{metrics.staff.total}</p>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>STEM Clubs</h3>
            <p className="stat-number">{metrics.clubs.total}</p>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">🔬</div>
          <div className="stat-content">
            <h3>Active Projects</h3>
            <p className="stat-number">{metrics.projects.inProgress}</p>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">🔧</div>
          <div className="stat-content">
            <h3>Equipment Items</h3>
            <p className="stat-number">{metrics.equipment.total}</p>
          </div>
        </div>

        <div className="stat-card stat-accent">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Sign-ins Today</h3>
            <p className="stat-number">{metrics.signups.today}</p>
          </div>
        </div>

        <div className="stat-card stat-accent">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Currently in Lab</h3>
            <p className="stat-number">{metrics.signups.currentlyInLab}</p>
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="metrics-grid">
        {/* Staff Breakdown */}
        <div className="metrics-card">
          <h2 className="card-title">Staff Distribution</h2>
          <div className="card-content">
            {Object.entries(metrics.staff.byLab).map(([lab, count]) => (
              <div key={lab} className="metric-row">
                <span className="metric-label">{lab}</span>
                <div className="metric-bar-container">
                  <div
                    className="metric-bar"
                    style={{ width: `${(count / metrics.staff.total) * 100}%` }}
                  />
                  <span className="metric-value">{count}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="card-footer">
            <h3>Communities</h3>
            <div className="community-tags">
              <span className="tag">FWS: {metrics.staff.communities.fws}</span>
              <span className="tag">Mesa: {metrics.staff.communities.mesa}</span>
              <span className="tag">Umoja: {metrics.staff.communities.umoja}</span>
              <span className="tag">Puente: {metrics.staff.communities.puente}</span>
              <span className="tag">Veteran: {metrics.staff.communities.veteran}</span>
            </div>
          </div>
        </div>

        {/* Projects Overview */}
        <div className="metrics-card">
          <h2 className="card-title">Projects Overview</h2>
          <div className="card-content">
            <div className="project-stats">
              <div className="project-stat">
                <span className="stat-label">In Progress</span>
                <span className="stat-value-large">{metrics.projects.inProgress}</span>
              </div>
              <div className="project-stat">
                <span className="stat-label">Completed</span>
                <span className="stat-value-large">{metrics.projects.completed}</span>
              </div>
              <div className="project-stat">
                <span className="stat-label">Avg. Completion</span>
                <span className="stat-value-large">{metrics.projects.averageCompletion}%</span>
              </div>
            </div>
            <h3 className="subsection-title">By Lab</h3>
            {Object.entries(metrics.projects.byLab).map(([lab, count]) => (
              <div key={lab} className="metric-row">
                <span className="metric-label">{lab}</span>
                <span className="metric-value">{count} projects</span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Distribution */}
        <div className="metrics-card">
          <h2 className="card-title">Equipment Inventory</h2>
          <div className="card-content">
            {Object.entries(metrics.equipment.byLab).map(([lab, count]) => (
              <div key={lab} className="metric-row">
                <span className="metric-label">{lab}</span>
                <div className="metric-bar-container">
                  <div
                    className="metric-bar equipment-bar"
                    style={{ width: `${(count / metrics.equipment.total) * 100}%` }}
                  />
                  <span className="metric-value">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sign-ups Activity */}
        <div className="metrics-card">
          <h2 className="card-title">Lab Activity</h2>
          <div className="card-content">
            <div className="activity-stat">
              <span className="activity-label">Today's Sign-ins</span>
              <span className="activity-value">{metrics.signups.today}</span>
            </div>
            <div className="activity-stat">
              <span className="activity-label">Currently in Lab</span>
              <span className="activity-value highlight">{metrics.signups.currentlyInLab}</span>
            </div>
            <div className="activity-stat">
              <span className="activity-label">This Week</span>
              <span className="activity-value">{metrics.signups.weekTotal}</span>
            </div>
            <div className="activity-stat">
              <span className="activity-label">Most Active Lab</span>
              <span className="activity-value">{metrics.signups.mostActiveLab}</span>
            </div>
          </div>
        </div>

        {/* Clubs Summary */}
        <div className="metrics-card">
          <h2 className="card-title">STEM Clubs</h2>
          <div className="card-content">
            <div className="club-stats">
              <div className="club-stat">
                <span className="stat-label">Total Clubs</span>
                <span className="stat-value-large">{metrics.clubs.total}</span>
              </div>
              <div className="club-stat">
                <span className="stat-label">Active Members</span>
                <span className="stat-value-large">{metrics.clubs.activeMembers}</span>
              </div>
              <div className="club-stat">
                <span className="stat-label">Upcoming Meetings</span>
                <span className="stat-value-large">{metrics.clubs.upcomingMeetings}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabMetricsPage;
