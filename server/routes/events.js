const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Added for file system operations

// Test endpoint to check database connectivity and table access
router.get('/test-db', (req, res) => {
  // Test basic connection
  db.query('SELECT 1 as test', (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database connection failed', details: err.message });
    }
    
    // Test event_reports table
    db.query('SELECT COUNT(*) as count FROM event_reports', (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'event_reports table access failed', details: err.message });
      }
      
      // Test events table
      db.query('SELECT COUNT(*) as count FROM events', (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'events table access failed', details: err.message });
        }
        
        // Test pc_events table
        db.query('SELECT COUNT(*) as count FROM pc_events', (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'pc_events table access failed', details: err.message });
          }
          
          res.json({ 
            message: 'Database connectivity test passed',
            tables: {
              event_reports: 'accessible',
              events: 'accessible', 
              pc_events: 'accessible'
            }
          });
        });
      });
    });
  });
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/reports/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'report-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only .docx (Word) files are allowed. Please upload a Word document.'));
    }
  },
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
});

// Function to update event statuses for past events
const updateEventStatuses = (events) => {
  const currentDate = new Date();
  
  events.forEach(event => {
    const eventDate = new Date(event.event_date);
    const shouldBeCompleted = eventDate < currentDate;
    
    if (shouldBeCompleted && event.status === 'upcoming') {
      // Update the status in database
      const updateSql = 'UPDATE events SET status = ? WHERE id = ?';
      db.query(updateSql, ['completed', event.id], (err, result) => {
        if (err) {
          // Error updating event status
        } else {
          // Update the status in the results array
          event.status = 'completed';
        }
      });
    }
  });
};

// Test endpoint to check events (no authentication required)
router.get('/test', (req, res) => {
  const sql = `
    SELECT e.*, d.name as department_name, au.name as created_by_name, r.role_name as creator_role
    FROM events e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN assigned_users au ON e.created_by = au.id
    LEFT JOIN roles r ON au.role_id = r.id
    ORDER BY e.event_date DESC, e.created_at DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    res.json({
      total_events: results.length,
      events: results,
      message: 'Test data from events table'
    });
  });
});

// Update all event statuses (admin endpoint)
router.post('/update-statuses', verifyToken, (req, res) => {
  const userRole = req.user.role?.toLowerCase();
  
  // Only allow PC users to update all event statuses
  if (userRole !== 'pc' && userRole !== 'program coordinator') {
    return res.status(403).json({ error: 'Access denied. Only Program Coordinators can update event statuses.' });
  }
  
  const currentDate = new Date();
  const updateSql = `
    UPDATE events 
    SET status = 'completed' 
    WHERE event_date < ? AND status = 'upcoming'
  `;
  
  db.query(updateSql, [currentDate], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    res.json({ 
      message: 'Event statuses updated successfully',
      updatedCount: result.affectedRows
    });
  });
});

// Get all events (for PC - all departments, for PO - their department only)
router.get('/all', verifyToken, (req, res) => {
  const userRole = req.user.role?.toLowerCase();
  const userDepartment = req.user.department;
  const userId = req.user.id;
  

  
  let sql = '';
  let params = [];
  
  // For PC and HSC users, show all events from all departments plus PC events
  if (userRole === 'pc' || userRole === 'program coordinator' || userRole === 'hsc' || userRole === 'head student coordinator') {
    // Get regular events
    const regularEventsSql = `
      SELECT e.*, d.name as department_name, au.name as created_by_name, 'regular' as event_type
      FROM events e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN assigned_users au ON e.created_by = au.id
      ORDER BY e.event_date DESC, e.created_at DESC
    `;
    
    // Get PC events
    const pcEventsSql = `
      SELECT 
        pe.id,
        pe.event_name,
        pe.event_date,
        pe.event_mode,
        pe.description,
        pe.status,
        pe.created_at,
        'PC Event' as department_name,
        au.name as created_by_name,
        'pc_event' as event_type
      FROM pc_events pe
      LEFT JOIN assigned_users au ON pe.created_by = au.id
      ORDER BY pe.event_date DESC, pe.created_at DESC
    `;
    
    // Execute both queries and combine results
    db.query(regularEventsSql, (err, regularResults) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      
      db.query(pcEventsSql, (err, pcResults) => {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        
        // Combine and sort results
        const allResults = [...regularResults, ...pcResults].sort((a, b) => 
          new Date(b.event_date) - new Date(a.event_date)
        );
        
        // Update status for past events
        updateEventStatuses(allResults);
        res.json(allResults);
      });
    });
    return;
  }
  // For PO users, only show events from their department (not PC-created events)
  else if (userRole === 'po' || userRole === 'program officer') {

    // If userDepartment is undefined, get it from database
    if (!userDepartment) {
      const userSql = 'SELECT au.department_id, d.name as department_name FROM assigned_users au LEFT JOIN departments d ON au.department_id = d.id WHERE au.id = ?';
      db.query(userSql, [userId], (err, userResults) => {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        
        if (userResults.length === 0 || !userResults[0].department_id) {
  
          return res.status(400).json({ error: 'User department not found' });
        }
        
        const departmentName = userResults[0].department_name;

        
        // Query events for this department (excluding PC-created events)
        const eventsSql = `
          SELECT e.*, d.name as department_name, au.name as created_by_name
          FROM events e
          LEFT JOIN departments d ON e.department_id = d.id
          LEFT JOIN assigned_users au ON e.created_by = au.id
          LEFT JOIN roles r ON au.role_id = r.id
          WHERE e.department_id = ? AND (r.role_name IS NULL OR r.role_name NOT IN ('Program Coordinator', 'PC'))
          ORDER BY e.event_date DESC, e.created_at DESC
        `;
        
        db.query(eventsSql, [userResults[0].department_id], (err, results) => {
          if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
          }
  
          // Update status for past events
          updateEventStatuses(results);
          res.json(results);
        });
      });
      return;
    }
    
    // If userDepartment is defined, use the original logic but exclude PC-created events
    sql = `
      SELECT e.*, d.name as department_name, au.name as created_by_name
      FROM events e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN assigned_users au ON e.created_by = au.id
      LEFT JOIN roles r ON au.role_id = r.id
      WHERE (d.name = ? OR d.name = ?) AND (r.role_name IS NULL OR r.role_name NOT IN ('Program Coordinator', 'PC'))
      ORDER BY e.event_date DESC, e.created_at DESC
    `;
    params = [userDepartment, userDepartment + ' Engineering'];
  }
  // For SC users, show all events (they will be filtered by department in frontend)
  else if (userRole === 'sc' || userRole === 'student coordinator') {

    sql = `
      SELECT e.*, d.name as department_name, au.name as created_by_name
      FROM events e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN assigned_users au ON e.created_by = au.id
      LEFT JOIN roles r ON au.role_id = r.id
      WHERE (r.role_name IS NULL OR r.role_name NOT IN ('Program Coordinator', 'PC'))
      ORDER BY e.event_date DESC, e.created_at DESC
    `;
  }
  // Fallback for any other role
  else {

    sql = `
      SELECT e.*, d.name as department_name, au.name as created_by_name
      FROM events e
      LEFT JOIN departments d ON e.department_id = d.id
      LEFT JOIN assigned_users au ON e.created_by = au.id
      ORDER BY e.event_date DESC, e.created_at DESC
    `;
  }
  

  
  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    // Update status for past events
    updateEventStatuses(results);
    res.json(results);
  });
});

// Get events for specific department (for SC users)
router.get('/department/:department', verifyToken, (req, res) => {
  const { department } = req.params;
  const userRole = req.user.role?.toLowerCase();
  
  // Only allow SC users to view department events
  if (userRole !== 'sc' && userRole !== 'student coordinator') {
    return res.status(403).json({ error: 'Access denied. Only Student Coordinators can view department events.' });
  }
  
  const sql = `
    SELECT e.*, d.name as department_name, au.name as created_by_name
    FROM events e
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN assigned_users au ON e.created_by = au.id
    LEFT JOIN roles r ON au.role_id = r.id
    WHERE (d.name = ? OR d.name = ?) AND (r.role_name IS NULL OR r.role_name NOT IN ('Program Coordinator', 'PC'))
    ORDER BY e.event_date DESC, e.created_at DESC
  `;
  
  const deptName = department.endsWith(' Engineering') ? department : department + ' Engineering';
  
  db.query(sql, [department, deptName], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    // Update status for past events
    updateEventStatuses(results);
    res.json(results);
  });
});

// Add new event
router.post('/add', verifyToken, (req, res) => {
  const { event_name, event_date, event_mode, description } = req.body;
  const createdBy = req.user.id;
  const userDepartment = req.user.department;
  

  
  // Check if user has permission to add events
  const userRole = req.user.role?.toLowerCase();
  const allowedRoles = ['pc', 'po', 'program coordinator', 'program officer'];
  
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ error: 'Access denied. Only Program Coordinators and Program Officers can add events.' });
  }

  if (!event_name || !event_date || !event_mode || !description) {
    return res.status(400).json({ error: 'Event name, date, mode, and description are required' });
  }

  // Validate event mode
  const validModes = ['online', 'offline', 'hybrid'];
  if (!validModes.includes(event_mode.toLowerCase())) {
    return res.status(400).json({ error: 'Event mode must be online, offline, or hybrid' });
  }

  // Get department ID
  const deptSql = 'SELECT id FROM departments WHERE name = ? OR name = ?';
  
  // Handle undefined department - try to get from database
  if (!userDepartment) {
    const userSql = 'SELECT au.department_id, d.name as department_name FROM assigned_users au LEFT JOIN departments d ON au.department_id = d.id WHERE au.id = ?';
    db.query(userSql, [createdBy], (err, userResults) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      
      if (userResults.length === 0 || !userResults[0].department_id) {
        return res.status(400).json({ error: 'User department not found. Please update your profile with department information.' });
      }
      
      const departmentId = userResults[0].department_id;
      const departmentName = userResults[0].department_name;
      
      // Determine event status based on date
      const eventDate = new Date(event_date);
      const currentDate = new Date();
      const status = eventDate > currentDate ? 'upcoming' : 'completed';
      
      // Insert new event
      const insertSql = `
        INSERT INTO events (event_name, event_date, event_mode, department_id, description, status, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const insertValues = [event_name, event_date, event_mode.toLowerCase(), departmentId, description, status, createdBy];
      
      db.query(insertSql, insertValues, (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        
        res.status(201).json({ 
          message: 'Event added successfully',
          id: result.insertId,
          status: status
        });
      });
    });
    return;
  }
  
  const deptName = userDepartment.endsWith(' Engineering') ? userDepartment : userDepartment + ' Engineering';
  
  db.query(deptSql, [userDepartment, deptName], (err, deptResults) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    if (deptResults.length === 0) {
      return res.status(404).json({ error: 'Department not found' });
    }
    
    const departmentId = deptResults[0].id;
    
    // Determine event status based on date
    const eventDate = new Date(event_date);
    const currentDate = new Date();
    const status = eventDate > currentDate ? 'upcoming' : 'completed';
    
    // Insert new event
    const insertSql = `
      INSERT INTO events (event_name, event_date, event_mode, department_id, description, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const insertValues = [event_name, event_date, event_mode.toLowerCase(), departmentId, description, status, createdBy];
    
    db.query(insertSql, insertValues, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      
      res.status(201).json({ 
        message: 'Event added successfully',
        id: result.insertId,
        status: status
      });
    });
  });
});

// Update event
router.put('/update/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { event_name, event_date, event_mode, description } = req.body;
  
  // Check if user has permission to edit events
  const userRole = req.user.role?.toLowerCase();
  const allowedRoles = ['pc', 'po', 'program coordinator', 'program officer'];
  
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ error: 'Access denied. Only Program Coordinators and Program Officers can edit events.' });
  }

  if (!event_name || !event_date || !event_mode || !description) {
    return res.status(400).json({ error: 'Event name, date, mode, and description are required' });
  }

  // Validate event mode
  const validModes = ['online', 'offline', 'hybrid'];
  if (!validModes.includes(event_mode.toLowerCase())) {
    return res.status(400).json({ error: 'Event mode must be online, offline, or hybrid' });
  }

  // Determine event status based on date
  const eventDate = new Date(event_date);
  const currentDate = new Date();
  const status = eventDate > currentDate ? 'upcoming' : 'completed';
  
  // Check if this is a PC event or regular event
  const checkSql = 'SELECT COUNT(*) as count FROM pc_events WHERE id = ?';
  db.query(checkSql, [id], (err, checkResult) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    const isPcEvent = checkResult[0].count > 0;
    
    if (isPcEvent) {
      // Update PC event
      const updatePcSql = `
        UPDATE pc_events 
        SET event_name = ?, event_date = ?, event_mode = ?, description = ?, status = ?
        WHERE id = ?
      `;
      
      db.query(updatePcSql, [event_name, event_date, event_mode.toLowerCase(), description, status, id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'PC Event not found' });
        }
        
        res.json({ message: 'PC Event updated successfully' });
      });
    } else {
      // Update regular event
      const updateSql = `
        UPDATE events 
        SET event_name = ?, event_date = ?, event_mode = ?, description = ?, status = ?
        WHERE id = ?
      `;
      
      db.query(updateSql, [event_name, event_date, event_mode.toLowerCase(), description, status, id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Event not found' });
        }
        
        res.json({ message: 'Event updated successfully' });
      });
    }
  });
});

// Delete event
router.delete('/delete/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  
  // Check if user has permission to delete events
  const userRole = req.user.role?.toLowerCase();
  const allowedRoles = ['pc', 'po', 'program coordinator', 'program officer'];
  
  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({ error: 'Access denied. Only Program Coordinators and Program Officers can delete events.' });
  }

  // Check if event exists
  const checkSql = 'SELECT id, event_name FROM events WHERE id = ?';
  
  db.query(checkSql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Delete the event
    const deleteSql = 'DELETE FROM events WHERE id = ?';
    db.query(deleteSql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      
      res.json({ 
        message: 'Event deleted successfully',
        deletedEvent: results[0].event_name
      });
    });
  });
});

// Submit event report (for SC, PC, and HSC users)
router.post('/submit-report', verifyToken, upload.single('report_file'), (req, res) => {
  const { event_id, submitted_by } = req.body;
  const submittedById = req.user.id;

  // Check if user has permission to submit reports
  const userRole = req.user.role?.toLowerCase();

  if (userRole !== 'sc' && userRole !== 'student coordinator' && userRole !== 'pc' && userRole !== 'program coordinator' && userRole !== 'hsc' && userRole !== 'head student coordinator') {
    return res.status(403).json({ error: 'Access denied. Only Student Coordinators, Program Coordinators, and Head Student Coordinators can submit reports.' });
  }

  if (!event_id || !submitted_by) {
    return res.status(400).json({ error: 'Event ID and submitted by are required' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'Report file is required and must be a .docx file.' });
  }

  // Check if event exists (either regular event or PC event)
  const eventSql = `
    SELECT 
      e.id,
      e.event_name,
      e.event_date,
      e.event_mode,
      e.description,
      e.status,
      e.created_at,
      d.name as department_name,
      e.department_id,
      'regular' as event_type
    FROM events e 
    LEFT JOIN departments d ON e.department_id = d.id 
    WHERE e.id = ?
  `;

  db.query(eventSql, [event_id], (err, eventResults) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    if (eventResults.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = eventResults[0];

    // Call the function to check and submit the report
    checkAndSubmitReport();

    function checkAndSubmitReport() {
      // Check if any report has already been submitted for this event
      let checkSql;
      let checkParams;

      if (event.event_type === 'pc_event') {
        // For PC events, check if any report exists for this event
        checkSql = `
          SELECT er.id 
          FROM event_reports er
          WHERE er.event_id = ?
        `;
        checkParams = [event_id];
      } else {
        // For regular events, check if any report exists for this event from the same department
        if (event.department_id) {
          checkSql = `
            SELECT er.id 
            FROM event_reports er
            LEFT JOIN events e ON er.event_id = e.id
            WHERE er.event_id = ? AND e.department_id = ?
          `;
          checkParams = [event_id, event.department_id];
        } else {
          // If no department_id, just check if any report exists for this event
          checkSql = `
            SELECT er.id 
            FROM event_reports er
            WHERE er.event_id = ?
          `;
          checkParams = [event_id];
        }
      }

      db.query(checkSql, checkParams, (err, reportResults) => {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }

        if (reportResults.length > 0) {
          return res.status(400).json({ 
            error: 'A report has already been submitted for this event.' 
          });
        }

        // Insert the report, including the file path
        const insertSql = `
          INSERT INTO event_reports (event_id, file_path, submitted_by, submitted_by_id, status, created_at)
          VALUES (?, ?, ?, ?, 'pending', NOW())
        `;

        db.query(insertSql, [event_id, req.file.path, submitted_by, submittedById], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
          }

          res.status(201).json({ 
            message: 'Report submitted successfully',
            report_id: result.insertId
          });
        });
      });
    }
  });
});

// Get reports for approval (for PO users) or own reports (for SC users)
router.get('/reports', verifyToken, (req, res) => {
  const userRole = req.user.role?.toLowerCase();
  const userId = req.user.id;
  
  if (userRole !== 'po' && userRole !== 'program officer' && userRole !== 'sc' && userRole !== 'student coordinator' && userRole !== 'pc' && userRole !== 'program coordinator' && userRole !== 'hsc' && userRole !== 'head student coordinator') {
    return res.status(403).json({ error: 'Access denied. Only Program Officers, Program Coordinators, Student Coordinators, and Head Student Coordinators can view reports.' });
  }
  
  // Get user's department
  const userSql = 'SELECT department_id FROM assigned_users WHERE id = ?';
  db.query(userSql, [userId], (err, userResults) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    if (userResults.length === 0) {
      return res.status(400).json({ error: 'User department not found' });
    }
    
    const departmentId = userResults[0].department_id;
    
    let reportsSql;
    let params;
    
    if (userRole === 'po' || userRole === 'program officer') {
      // PO sees all reports from their department (excluding PC-submitted reports)
      reportsSql = `
        SELECT er.*, e.event_name, e.event_date, d.name as department_name, au.name as submitted_by_name
        FROM event_reports er
        LEFT JOIN events e ON er.event_id = e.id
        LEFT JOIN departments d ON e.department_id = d.id
        LEFT JOIN assigned_users au ON er.submitted_by_id = au.id
        LEFT JOIN roles r ON au.role_id = r.id
        WHERE e.department_id = ? AND (r.role_name IS NULL OR r.role_name NOT IN ('Program Coordinator', 'PC'))
        ORDER BY er.created_at DESC
      `;
      params = [departmentId];
    } else if (userRole === 'pc' || userRole === 'program coordinator' || userRole === 'hsc' || userRole === 'head student coordinator') {
      // PC and HSC see all reports from all departments
      reportsSql = `
        SELECT er.*, e.event_name, e.event_date, d.name as department_name, au.name as submitted_by_name
        FROM event_reports er
        LEFT JOIN events e ON er.event_id = e.id
        LEFT JOIN departments d ON e.department_id = d.id
        LEFT JOIN assigned_users au ON er.submitted_by_id = au.id
        ORDER BY er.created_at DESC
      `;
      params = [];
    } else {
      // SC sees all reports from their department (shared across all SCs in the department)
      reportsSql = `
        SELECT er.*, e.event_name, e.event_date, d.name as department_name, au.name as submitted_by_name
        FROM event_reports er
        LEFT JOIN events e ON er.event_id = e.id
        LEFT JOIN departments d ON e.department_id = d.id
        LEFT JOIN assigned_users au ON er.submitted_by_id = au.id
        WHERE e.department_id = ?
        ORDER BY er.created_at DESC
      `;
      params = [departmentId];
    }
    
    db.query(reportsSql, params, (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      res.json(results);
    });
  });
});

// Download report template (Word file) - MUST be before parameterized routes
router.get('/reports/template/download', verifyToken, (req, res) => {
  // Allow all authenticated users to download the template
  // No role restrictions for template download
  
  // Path to the Word template file
  const templatePath = path.join(__dirname, '..', 'uploads', 'templates', 'nss_report_template.docx');
  
  // Check if file exists
  if (!fs.existsSync(templatePath)) {
    return res.status(404).json({ error: 'Template file not found. Please contact administrator.' });
  }
  
  // Set headers for file download
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', 'attachment; filename="nss_event_report_template.docx"');
  
  // Send the file
  res.sendFile(templatePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error downloading template file' });
    }
  });
});

// Approve/Reject report (for PO users)
router.put('/reports/:id/status', verifyToken, (req, res) => {
  const { id } = req.params;
  const { status, comments } = req.body;
  const userId = req.user.id;
  
  const userRole = req.user.role?.toLowerCase();
  if (userRole !== 'po' && userRole !== 'program officer') {
    return res.status(403).json({ error: 'Access denied. Only Program Officers can approve/reject reports.' });
  }
  
  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be either approved or rejected' });
  }
  
  // Check if report exists and user has permission
  const checkSql = `
    SELECT er.*, e.department_id 
    FROM event_reports er
    LEFT JOIN events e ON er.event_id = e.id
    WHERE er.id = ?
  `;
  
  db.query(checkSql, [id], (err, reportResults) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    if (reportResults.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    const report = reportResults[0];
    
    // Check if user is from the same department
    const userSql = 'SELECT department_id FROM assigned_users WHERE id = ?';
    db.query(userSql, [userId], (err, userResults) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      
      if (userResults.length === 0 || userResults[0].department_id !== report.department_id) {
        return res.status(403).json({ error: 'Access denied. You can only approve/reject reports from your department.' });
      }
      
      // Update report status
      const updateSql = `
        UPDATE event_reports 
        SET status = ?, comments = ?, approved_by = ?, approved_at = NOW()
        WHERE id = ?
      `;
      
      db.query(updateSql, [status, comments, userId, id], (err, result) => {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        
        res.json({ 
          message: `Report ${status} successfully`,
          status: status
        });
      });
    });
  });
});

// Download report file
router.get('/reports/:id/download', verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role?.toLowerCase();

  // Only PO, PC, and HSC can download reports
  if (!['po', 'pc', 'hsc', 'program officer', 'program coordinator', 'head student coordinator'].includes(userRole)) {
    return res.status(403).json({ error: 'Access denied. Only Program Officers, Program Coordinators, and Head Student Coordinators can download reports.' });
  }

  // Get report details
  const reportSql = `
    SELECT er.*, e.department_id 
    FROM event_reports er
    LEFT JOIN events e ON er.event_id = e.id
    WHERE er.id = ?
  `;

  db.query(reportSql, [id], (err, reportResults) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (reportResults.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    const report = reportResults[0];

    if (userRole === 'po' || userRole === 'program officer') {
      // PO: only from their department
      const userSql = 'SELECT department_id FROM assigned_users WHERE id = ?';
      db.query(userSql, [userId], (err, userResults) => {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        if (userResults.length === 0 || userResults[0].department_id !== report.department_id) {
          return res.status(403).json({ error: 'Access denied. You can only download reports from your department.' });
        }
        res.download(report.file_path);
      });
    } else {
      // PC and HSC: can download any report
      res.download(report.file_path);
    }
  });
});

// Delete report (for SC users - only their own reports)
router.delete('/reports/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role?.toLowerCase();
  
  if (userRole !== 'sc' && userRole !== 'student coordinator') {
    return res.status(403).json({ error: 'Access denied. Only Student Coordinators can delete their own reports.' });
  }
  
  // Check if report exists and belongs to the user
  const checkSql = 'SELECT * FROM event_reports WHERE id = ? AND submitted_by_id = ?';
  db.query(checkSql, [id, userId], (err, reportResults) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    if (reportResults.length === 0) {
      return res.status(404).json({ error: 'Report not found or you do not have permission to delete it.' });
    }
    
    const report = reportResults[0];
    
    // Only allow deletion if status is pending or rejected
    if (report.status !== 'pending' && report.status !== 'rejected') {
      return res.status(400).json({ error: 'You can only delete reports that are still pending or have been rejected.' });
    }
    
    // Delete the report
    const deleteSql = 'DELETE FROM event_reports WHERE id = ?';
    db.query(deleteSql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      
      res.json({ message: 'Report deleted successfully' });
    });
  });
});

// Delete report by PO/PC (from their department)
router.delete('/reports/admin-delete/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role?.toLowerCase();
  
  // Only PO and PC can delete reports
  if (userRole !== 'po' && userRole !== 'program officer' && userRole !== 'pc' && userRole !== 'program coordinator') {
    return res.status(403).json({ error: 'Access denied. Only Program Officers and Program Coordinators can delete reports.' });
  }
  
  if (userRole === 'po' || userRole === 'program officer') {
    // For PO users, check if they can delete this specific report
    const getDeptSql = 'SELECT department_id FROM assigned_users WHERE id = ? LIMIT 1';
    
    db.query(getDeptSql, [userId], (err, deptResults) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      
      if (!deptResults || deptResults.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const userDepartmentId = deptResults[0].department_id;
      
      // Check if the report belongs to PO's department
      const checkSql = `
        SELECT er.id FROM event_reports er
        LEFT JOIN events e ON er.event_id = e.id
        WHERE er.id = ? AND e.department_id = ?
      `;
      
      db.query(checkSql, [id, userDepartmentId], (err, checkResults) => {
        if (err) {
          return res.status(500).json({ error: 'Database error', details: err.message });
        }
        
        if (checkResults.length === 0) {
          return res.status(403).json({ error: 'Access denied. You can only delete reports from your department.' });
        }
        
        // Delete the report
        const deleteSql = 'DELETE FROM event_reports WHERE id = ?';
        db.query(deleteSql, [id], (err, result) => {
          if (err) {
            return res.status(500).json({ error: 'Database error', details: err.message });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Report not found' });
          }

          res.json({ message: 'Report deleted successfully' });
        });
      });
    });
  } else {
    // For PC users, allow deleting any report
    const deleteSql = 'DELETE FROM event_reports WHERE id = ?';
    db.query(deleteSql, [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Report not found' });
      }

      res.json({ message: 'Report deleted successfully' });
    });
  }
});

// PC Events CRUD operations
// Add PC event
router.post('/pc/add', verifyToken, (req, res) => {
  const { event_name, event_date, event_mode, description } = req.body;
  const createdBy = req.user.id;
  
  // Check if user has permission to add PC events
  const userRole = req.user.role?.toLowerCase();
  if (userRole !== 'pc' && userRole !== 'program coordinator') {
    return res.status(403).json({ error: 'Access denied. Only Program Coordinators can add PC events.' });
  }

  if (!event_name || !event_date || !event_mode || !description) {
    return res.status(400).json({ error: 'Event name, date, mode, and description are required' });
  }

  // Validate event mode
  const validModes = ['online', 'offline', 'hybrid'];
  if (!validModes.includes(event_mode.toLowerCase())) {
    return res.status(400).json({ error: 'Event mode must be online, offline, or hybrid' });
  }

  // Determine event status based on date
  const eventDate = new Date(event_date);
  const currentDate = new Date();
  const status = eventDate > currentDate ? 'upcoming' : 'completed';
  
  // Add PC event
  const insertSql = `
    INSERT INTO pc_events 
    (event_name, event_date, event_mode, description, status, created_by) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  db.query(insertSql, [event_name, event_date, event_mode.toLowerCase(), description, status, createdBy], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    res.json({ 
      message: 'PC Event added successfully',
      eventId: result.insertId
    });
  });
});

// Delete PC event
router.delete('/pc/delete/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  
  // Check if user has permission to delete PC events
  const userRole = req.user.role?.toLowerCase();
  if (userRole !== 'pc' && userRole !== 'program coordinator') {
    return res.status(403).json({ error: 'Access denied. Only Program Coordinators can delete PC events.' });
  }
  
  const deleteSql = 'DELETE FROM pc_events WHERE id = ?';
  
  db.query(deleteSql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'PC Event not found' });
    }
    
    res.json({ message: 'PC Event deleted successfully' });
  });
});

// Get PC events only (for HSC users)
router.get('/pc/all', verifyToken, (req, res) => {
  const userRole = req.user.role?.toLowerCase();
  
  // Only allow PC and HSC users to view PC events
  if (userRole !== 'pc' && userRole !== 'program coordinator' && userRole !== 'hsc' && userRole !== 'head student coordinator') {
    return res.status(403).json({ error: 'Access denied. Only Program Coordinators and Head Student Coordinators can view PC events.' });
  }
  
  const sql = `
    SELECT 
      pe.*,
      'PC Event' as department_name,
      au.name as created_by_name,
      'pc_event' as event_type
    FROM pc_events pe
    LEFT JOIN assigned_users au ON pe.created_by = au.id
    ORDER BY pe.event_date DESC, pe.created_at DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    
    // Update status for past events
    updateEventStatuses(results);
    res.json(results);
  });
});



// Simple file validation helper
const validateWordFile = (filePath) => {
  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: 'Uploaded file not found' };
    }
    
    // Check file size (20MB limit)
    const stats = fs.statSync(filePath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    
    if (fileSizeInMB > 20) {
      return { valid: false, error: 'File size too large. Maximum size is 20MB.' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Error validating file: ' + error.message };
  }
};

module.exports = router; 