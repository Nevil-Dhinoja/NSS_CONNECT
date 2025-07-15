import React from 'react';
import "../pages/WorkingHours.css";
import clockIcon from "../assets/clock-outline.svg";

const WorkingHours = () => {
  const completedHours = 45;
  const targetHours = 120;
  const progressPercentage = (completedHours / targetHours) * 100;

  const activities = [
    { activity: 'Website Content Creation', hours: 1, date: '4/2/2025', status: 'Approved' },
    { activity: 'Volunteer Training', hours: 2, date: '4/28/2025', status: 'Pending' },
    { activity: 'Event Planning Meeting', hours: 1, date: '4/15/2025', status: 'Approved' },
    { activity: 'Social Media Management', hours: 2, date: '2/30/2025', status: 'Approved' },
  ];

  const pendingApprovals = [
    { student: 'Ayushi', activity: 'Social Media Management', hours: 2, date: '2/30/2025' },
  ];

  return (
    <div>
      <div className="progress-card">
        <div className="progress-info">
          <div className="progress-icon">
            <img src={clockIcon} alt="Clock Icon" className="clock-image" />
          </div>
          <div>
            <h3 className="progress-title">Working Hours Progress</h3>
            <p className="progress-subtitle">Academic Year 2023-24</p>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-bar">
            <div
              className="progress-filled"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="progress-details">
            <p>
              You have completed <strong>{Math.floor(progressPercentage)}%</strong> of your target hours.
            </p>
            <span className="progress-count">
              {completedHours} / {targetHours} hours
            </span>
          </div>
        </div>
      </div>

      <div className="working-hours-card">
        <h2 className="title">Working Hours History</h2>
        <div className="search-bar">
          <input type="text" placeholder="Search activities..." />
        </div>
        <table className="activity-table">
          <thead>
            <tr>
              <th>Activity</th>
              <th>Hours</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((item, index) => (
              <tr key={index}>
                <td>{item.activity}</td>
                <td>{item.hours}</td>
                <td>{item.date}</td>
                <td>
                  <span className={`status ${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <div className="pending-approvals-card">
        <h2 className="P_title">Pending Hours Approvals</h2>
        <table className="approval-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Activity</th>
              <th>Hours</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingApprovals.map((item, index) => (
              <tr key={index}>
                <td>{item.student}</td>
                <td>{item.activity}</td>
                <td>{item.hours}</td>
                <td>{item.date}</td>
                <td>
                  <button className="btn-approve">✔ Approve</button>
                  <button className="btn-reject">✖ Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}
    </div>
  );
};

export default WorkingHours;