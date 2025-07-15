const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');

// Test endpoint to check working hours data (no authentication required)
router.get('/test-data', (req, res) => {
  const sql = `
    SELECT wh.*, au.name as student_name, au.department_id, d.name as department_name
    FROM working_hours wh
JOIN assigned_users au ON wh.login_id = au.login_id
    LEFT JOIN departments d ON au.department_id = d.id
    ORDER BY wh.date DESC, wh.created_at DESC
    LIMIT 10`;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    res.json({
      total_entries: results.length,
      entries: results,
      message: 'Test data from working_hours table'
    });
  });
});
const jwt = require('jsonwebtoken');

// Add working hours entry
router.post('/addWorkingHours', verifyToken, (req, res) => {
  
  const { activity_name, date, start_time, end_time, description } = req.body;
  const email = req.user.email; // Use email instead of login_id



  if (!activity_name || !date || !start_time || !end_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Get login_id and department_id from assigned_users table using email
  const getUserSql = 'SELECT id, department_id, login_id FROM assigned_users WHERE email = ? LIMIT 1';
  
  db.query(getUserSql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const department_id = results[0].department_id;
    const login_id = results[0].login_id;

    const sql = `
      INSERT INTO working_hours 
        (login_id, activity_name, date, start_time, end_time, description, department_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [login_id, activity_name, date, start_time, end_time, description || 'No Comments', department_id];

    db.query(sql, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      res.status(200).json({ 
        message: 'Working hours added successfully',
        id: result.insertId
      });
    });
  });
});

// Get working hours for current user
router.get('/my-hours', verifyToken, (req, res) => {
  const email = req.user.email;
  
  const sql = `
    SELECT wh.id, wh.login_id, wh.activity_name, wh.date, wh.start_time, wh.end_time, wh.hours, wh.status, wh.description, wh.created_at
    FROM working_hours wh
    JOIN assigned_users au ON wh.login_id = au.login_id
    WHERE au.email = ? 
    ORDER BY wh.date DESC, wh.created_at DESC`;

  db.query(sql, [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    res.json(results);
  });
});

// Get working hours for specific department (Program Officers only)
router.get('/department/:department', verifyToken, (req, res) => {
  // Accept both 'PO' and 'Program Officer' (case-insensitive)
  const role = (req.user.role || '').toLowerCase();
  if (role !== 'program officer' && role !== 'po') {
    return res.status(403).json({ error: 'Access denied. Only Program Officers can view working hours.' });
  }

  const { department } = req.params;
  
  const sql = `
    SELECT wh.id, wh.login_id, wh.activity_name, wh.date, wh.start_time, wh.end_time, wh.hours, wh.status, wh.description, wh.created_at, au.name as student_name, au.department_id 
    FROM working_hours wh
    JOIN assigned_users au ON wh.login_id = au.login_id
    WHERE au.department_id = ?
    ORDER BY wh.date DESC, wh.created_at DESC`;

  db.query(sql, [department], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json(results);
  });
});

// Get working hours for current user's department (Program Officers only)
router.get('/department/my', verifyToken, (req, res) => {
  // Accept both 'PO' and 'Program Officer' (case-insensitive)
  const role = (req.user.role || '').toLowerCase();
  if (role !== 'program officer' && role !== 'po' && role !== 'pc' && role !== 'program coordinator') {
    return res.status(403).json({ error: 'Access denied. Only Program Officers and Program Coordinators can view working hours.' });
  }

  const email = req.user.email;
  
  // First get the user's department_id
  const getDeptSql = 'SELECT department_id FROM assigned_users WHERE email = ? LIMIT 1';
  
  db.query(getDeptSql, [email], (err, deptResults) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (!deptResults || deptResults.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userDepartmentId = deptResults[0].department_id;
    
    // Then get working hours for that department
    const sql = `
      SELECT wh.id, wh.login_id, wh.activity_name, wh.date, wh.start_time, wh.end_time, wh.hours, wh.status, wh.description, wh.created_at, au.name as student_name, au.department_id 
      FROM working_hours wh
      JOIN assigned_users au ON wh.login_id = au.login_id
      WHERE au.department_id = ?
      ORDER BY wh.date DESC, wh.created_at DESC`;
    
    db.query(sql, [userDepartmentId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      res.json(results);
    });
  });
});

// Get all working hours for approval (Program Officers and Coordinators only)
router.get('/all', verifyToken, (req, res) => {
  // Accept both 'PO' and 'Program Officer' (case-insensitive)
  const role = (req.user.role || '').toLowerCase();
  
  if (role !== 'program officer' && role !== 'po' && role !== 'pc' && role !== 'program coordinator' && role !== 'hsc' && role !== 'head student coordinator') {
    return res.status(403).json({ 
      error: 'Access denied. Only Program Officers, Program Coordinators, and Head Student Coordinators can view all working hours.',
      userRole: req.user.role,
      normalizedRole: role
    });
  }

  const email = req.user.email;
  
  // For PO users, only show working hours from their department
  if (role === 'po' || role === 'program officer') {
    // First get the PO's department
    const getDeptSql = 'SELECT department_id FROM assigned_users WHERE email = ? LIMIT 1';
    
    db.query(getDeptSql, [email], (err, deptResults) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      
      if (!deptResults || deptResults.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const userDepartmentId = deptResults[0].department_id;
      
      // Get working hours only from PO's department
      const sql = `
        SELECT wh.id, wh.login_id, wh.activity_name, wh.date, wh.start_time, wh.end_time, wh.hours, wh.status, wh.description, wh.created_at, au.name as student_name, au.department_id, d.name as department_name
        FROM working_hours wh
        JOIN assigned_users au ON wh.login_id = au.login_id
        LEFT JOIN departments d ON au.department_id = d.id
        WHERE au.department_id = ?
        ORDER BY wh.date DESC, wh.created_at DESC`;
      
      db.query(sql, [userDepartmentId], (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.json(results);
      });
    });
  } else {
    // For PC and HSC users, show all working hours
    const sql = `
      SELECT wh.id, wh.login_id, wh.activity_name, wh.date, wh.start_time, wh.end_time, wh.hours, wh.status, wh.description, wh.created_at, au.name as student_name, au.department_id, d.name as department_name
      FROM working_hours wh
      JOIN assigned_users au ON wh.login_id = au.login_id
      LEFT JOIN departments d ON au.department_id = d.id
      ORDER BY wh.date DESC, wh.created_at DESC`;
    
    db.query(sql, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      res.json(results);
    });
  }
});

// Update working hours entry (only by the user who created it)
router.put('/update/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { activity_name, date, start_time, end_time, description } = req.body;
  const email = req.user.email;

  if (!activity_name || !date || !start_time || !end_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const sql = `
    UPDATE working_hours 
    SET activity_name = ?, date = ?, start_time = ?, end_time = ?, description = ?
    WHERE id = ? AND login_id = (SELECT login_id FROM assigned_users WHERE email = ?) AND status = 'pending'`;

  db.query(sql, [activity_name, date, start_time, end_time, description || 'No Comments', id, email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Working hours entry not found, you do not have permission to edit it, or it has already been approved' });
    }

    res.json({ message: 'Working hours updated successfully' });
  });
});

// Update working hours status (approve/reject)
router.put('/update-status/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Only PC and HSC can update status
  const role = (req.user.role || '').toLowerCase();
  if (role !== 'pc' && role !== 'program coordinator' && role !== 'hsc' && role !== 'head student coordinator') {
    return res.status(403).json({ error: 'Access denied. Only Program Coordinators and Head Student Coordinators can update status.' });
  }

  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be pending, approved, or rejected.' });
  }

  const sql = 'UPDATE working_hours SET status = ? WHERE id = ?';
  db.query(sql, [status, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Working hours entry not found' });
    }
    res.json({ message: 'Status updated successfully' });
  });
});

// Approve working hours entry
router.put('/approve/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const role = (req.user.role || '').toLowerCase();
  if (role !== 'pc' && role !== 'program coordinator' && role !== 'hsc' && role !== 'head student coordinator') {
    return res.status(403).json({ error: 'Access denied. Only Program Coordinators and Head Student Coordinators can approve working hours.' });
  }
  const sql = 'UPDATE working_hours SET status = "approved" WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Working hours entry not found' });
    }
    res.json({ message: 'Working hours approved successfully' });
  });
});

// Reject working hours entry
router.put('/reject/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const role = (req.user.role || '').toLowerCase();
  if (role !== 'pc' && role !== 'program coordinator' && role !== 'hsc' && role !== 'head student coordinator') {
    return res.status(403).json({ error: 'Access denied. Only Program Coordinators and Head Student Coordinators can reject working hours.' });
  }
  const sql = 'UPDATE working_hours SET status = "rejected" WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Working hours entry not found' });
    }
    res.json({ message: 'Working hours rejected successfully' });
  });
});

// Delete working hours entry (only by the user who created it)
router.delete('/delete/:id', verifyToken, (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM working_hours WHERE id = ? AND login_id = ?';

  db.query(sql, [id, req.user.login_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Working hours entry not found or you do not have permission to delete it' });
    }

    res.json({ message: 'Working hours deleted successfully' });
  });
});

// Delete working hours entry by PO/PC (from their department)
router.delete('/admin-delete/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const userRole = req.user.role?.toLowerCase();

  // Only PO and PC can delete working hours
  if (userRole !== 'po' && userRole !== 'program officer' && userRole !== 'pc' && userRole !== 'program coordinator') {
    return res.status(403).json({ error: 'Access denied. Only Program Officers and Program Coordinators can delete working hours.' });
  }

  if (userRole === 'po' || userRole === 'program officer') {
    // For PO users, check if they can delete this specific working hours entry
    const getDeptSql = 'SELECT department_id FROM assigned_users WHERE email = ? LIMIT 1';
    
    db.query(getDeptSql, [req.user.email], (err, deptResults) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      
      if (!deptResults || deptResults.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const userDepartmentId = deptResults[0].department_id;
      
      // Check if the working hours entry belongs to PO's department
      const checkSql = `
        SELECT wh.id FROM working_hours wh
        JOIN assigned_users au ON wh.login_id = au.login_id
        WHERE wh.id = ? AND au.department_id = ?
      `;
      
      db.query(checkSql, [id, userDepartmentId], (err, checkResults) => {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        
        if (checkResults.length === 0) {
          return res.status(403).json({ error: 'Access denied. You can only delete working hours from your department.' });
        }
        
        // Delete the working hours entry
        const deleteSql = 'DELETE FROM working_hours WHERE id = ?';
        db.query(deleteSql, [id], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Working hours entry not found' });
          }

          res.json({ message: 'Working hours deleted successfully' });
        });
      });
    });
  } else {
    // For PC users, allow deleting any working hours entry
    const deleteSql = 'DELETE FROM working_hours WHERE id = ?';
    db.query(deleteSql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Working hours entry not found' });
      }

      res.json({ message: 'Working hours deleted successfully' });
    });
  }
});

module.exports = router; 