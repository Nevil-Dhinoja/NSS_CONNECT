import React, { useState } from 'react';
import '../pages/Setting.css';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="settings-container">
      <h2 className="stitle">Settings</h2>
      <div className="tabs">
        <button onClick={() => setActiveTab('account')} className={activeTab === 'account' ? 'active' : ''}>Account</button>
        <button onClick={() => setActiveTab('notifications')} className={activeTab === 'notifications' ? 'active' : ''}>Notifications</button>
        <button onClick={() => setActiveTab('security')} className={activeTab === 'security' ? 'active' : ''}>Security</button>
      </div>

      <div className="tab-content">
        {activeTab === 'account' && (
          <div className="section">
            <h3>Account Settings</h3>
            <label>Full Name</label>
            <input type="text" defaultValue="Dhruv Rupapara" />

            <label>Email Address</label>
            <input type="email" defaultValue="student@nss.edu" />

            <label>Role</label>
            <input type="text" value="Student Coordinator" disabled />

            <button className="save-btn">Save Changes</button>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="section">
            <h3>Notification Preferences</h3>
            <p>Configure how you want to receive notifications.</p>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="section">
            <h3>Security Settings</h3>
            <label>Current Password</label>
            <input type="password" />

            <label>New Password</label>
            <input type="password" />

            <label>Confirm New Password</label>
            <input type="password" />

            <button className="save-btn">Update Password</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;

// kindly refer this beckend developer: nevil 
// router.put('/update-role/:id', authenticate, isAdmin, async (req, res) => {
//   const { role } = req.body;
//   const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
//   res.json(updatedUser);
// });