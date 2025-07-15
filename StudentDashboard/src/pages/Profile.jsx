import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: 'Dhruv',
    lastName: 'Rupapara',
    email: 'student@nss.edu',
    phone: '+91 123456789',
    address: 'Anand, Gujarat',
    bio: 'NSS Volunteer passionate about community service',
    joined: 'January 2023',
    role: 'Student Coordinator'
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert('Changes saved locally!');
  };

  return (
    <div className="profile-wrapper">
      <h2 className='ptitle'>My Profile</h2>
      <div className="profile-layout">
        {/* Card 1 - Summary */}
        <div className="profile-summary_card">
          <div className="avatar">DR</div>
          <h3>{profile.firstName} {profile.lastName}</h3>
          <p className="email">{profile.email}</p>
          <button className="role-btn">{profile.role}</button>
          <button className="change-pic">Change Profile Picture</button>
          <div className="contact-info">
            <p><i className="fa fa-envelope"></i> {profile.email}</p>
            <p><i className="fa fa-phone"></i> {profile.phone}</p>
            <p><i className="fa fa-calendar"></i> Joined: {profile.joined}</p>
          </div>
        </div>

        {/* Card 2 - Details */}
        <div className="profile-details-card">
          <h4 className='ptitle'>Edit Personal Information</h4>
          <div className="form-row">
            <input name="firstName" value={profile.firstName} onChange={handleChange} placeholder="First Name" />
            <input name="lastName" value={profile.lastName} onChange={handleChange} placeholder="Last Name" />
          </div>
          <div className='detail-row'>
          <input name="email" value={profile.email} onChange={handleChange} placeholder="Email Address" />
          <input name="phone" value={profile.phone} onChange={handleChange} placeholder="Phone Number" />
          <input name="address" value={profile.address} onChange={handleChange} placeholder="Address" />
          <textarea name="bio" value={profile.bio} onChange={handleChange} placeholder="Bio" rows={3}></textarea>
          </div>
          <button className="save-btn" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
