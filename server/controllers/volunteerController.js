const db = require('../db');




exports.addVolunteer = (req, res) => {
    const { name, adhar_no, gender, dob, department, year, email, contact } = req.body;
    const userRole = req.user.role?.toLowerCase();
  
    if (!name || !adhar_no || !gender || !dob || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // For Student Coordinators, enforce CE department only
    if ((userRole === 'sc' || userRole === 'student coordinator') && department !== 'CE') {
      return res.status(403).json({ error: 'Student Coordinators can only add volunteers to the CE department' });
    }
  
    const sql = `
      INSERT INTO volunteers 
        (name, adhar_no, gender, dob, department, year, email, contact, added_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
    db.query(sql, [name, adhar_no, gender, dob, department, year, email, contact, req.user.id], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Volunteer with this Adhar No already exists' });
        }
        return res.status(500).json({ error: 'Database error', details: err });
      }
  
      res.status(200).json({ message: 'Volunteer added successfully' });
    });
  };
