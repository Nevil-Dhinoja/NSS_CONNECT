import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Head Student Coordinator Dashboard</h2>
        <button className="add-hours-button">
          <i className="fa fa-plus-circle"></i> Add Working Hours
        </button>
      </div>

      <div className="dashboard-cards">
        <div className="card working-hours">
          <div className="card-title">
            <i className="fa fa-clock-o" aria-hidden="true"></i> Working Hours Progress
          </div>
          <div className="progress-bar">
            <div className="progress-filled" style={{ width: '38%' }}></div>
          </div>
          <div className="progress-info">
            45 / 120 hrs
          </div>
          <p className="progress-note">
            You have completed <strong>38%</strong> of your target hours.
          </p>
        </div>

        <div className="card events">
          <div className="card-title">
            <i className="fa fa-calendar" aria-hidden="true"></i> Events Participated
          </div>
          <div className="card-value">8</div>
        </div>

        <div className="card approvals">
          <div className="card-title">
            <i className="fa fa-clock-o" aria-hidden="true"></i> Pending Approvals
          </div>
          <div className="card-value">3</div>
        </div>
      </div>

      <div className="recent-working-hours">
        <div className="recent-header">
          <h3>Recent Working Hours</h3>
          <a href="#" className="view-all">View All</a>
        </div>
        <table className="working-hours-table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Hours</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Website Content Creation</td>
              <td>3</td>
              <td>5/10/2023</td>
              <td><span className="status approved">Approved</span></td>
            </tr>
            <tr>
              <td>Volunteer Training</td>
              <td>2</td>
              <td>5/8/2023</td>
              <td><span className="status pending">Pending</span></td>
            </tr>
            <tr>
              <td>Event Planning Meeting</td>
              <td>1.5</td>
              <td>5/5/2023</td>
              <td><span className="status approved">Approved</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="upcoming-events">
        <div className="recent-header">
          <h3>Upcoming Events</h3>
          <a href="#" className="view-all">View All</a>
        </div>
        <div className="event-cards">
          <div className="event-card">
            <h4>Tree Plantation Drive</h4>
            <p><i className="fa fa-calendar"></i> 5/20/2023</p>
            <p><i className="fa fa-user"></i> Role: Team Member</p>
            <button className="view-details-button">View Details</button>
          </div>
          <div className="event-card">
            <h4>Digital Literacy Workshop</h4>
            <p><i className="fa fa-calendar"></i> 5/25/2023</p>
            <p><i className="fa fa-user"></i> Role: Organizer</p>
            <button className="view-details-button">View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
