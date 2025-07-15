const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const verifyToken = require('../middleware/verifyToken');
const { sendWelcomeEmail, sendNotificationToPO, sendWelcomeEmailToPO, sendNotificationToPC, validateEmail, validatePOEmail, validateSCEmail, checkEmailExists } = require('../services/emailService');

// Login route
router.post('/login', async (req, res) => {
  const { login_id, password, role } = req.body;

  const sql = `SELECT assigned_users.*, roles.role_name, departments.name as department_name, assigned_users.password_hash as password
               FROM assigned_users 
               LEFT JOIN roles ON assigned_users.role_id = roles.id
               LEFT JOIN departments ON assigned_users.department_id = departments.id
               WHERE assigned_users.login_id = ?`;

  db.query(sql, [login_id], async (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const user = result[0];

    // Validate that the user's actual role matches the selected role
    if (role) {
      const roleMapping = {
        'pc': 'Program Coordinator',
        'po': 'Program Officer', 
        'sc': 'Student Coordinator',
        'hsc': 'Head Student Coordinator'
      };
      const expectedRole = roleMapping[role.toLowerCase()];
      
      if (role && user.role_name !== expectedRole) {
        return res.status(401).json({ 
          success: false, 
          message: `Access denied. You are registered as ${user.role_name}, not ${expectedRole}` 
        });
      }
    }

    // Check if user has a password
    if (!user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials - no password set' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        name: user.name, 
        role: user.role_name, 
        department: user.department_name,
        email: user.email,
        contact: user.contact
      },
      process.env.JWT_SECRET || 'nss-charusat-jwt-secret-2024',
      { expiresIn: '24h' }
    );
    
    res.json({ 
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role_name,
        department: user.department_name,
        email: user.email,
        contact: user.contact
      }
    });
  });
});

// Add Student Coordinator (PO only)
router.post('/add-student-coordinator', verifyToken, async (req, res) => {
  const { name, email, department, contact } = req.body;
  const poId = req.user.id;
  const poRole = req.user.role?.toLowerCase();

  // Allow both PO and PC to add SC
  if (poRole !== 'po' && poRole !== 'program officer' && poRole !== 'pc' && poRole !== 'program coordinator') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Only Program Officers and Program Coordinators can add Student Coordinators.' 
    });
  }

  // Validate required fields
  if (!name || !email || !department || !contact) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required: name, email, department, contact' 
    });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email format. Please enter a valid email address.' 
    });
  }
  // Validate SC email domain (must end with @charusat.edu.in)
  if (req.path.includes('student-coordinator') && !validateSCEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Student Coordinator email must end with @charusat.edu.in' 
    });
  }
  // Validate PO email domain (must end with @charusat.ac.in)
  if (req.path.includes('program-officer') && req.method === 'POST' && !validatePOEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Program Officer email must end with @charusat.ac.in' 
    });
  }
  
  try {
    // Check if email already exists
    const checkEmailSql = 'SELECT id FROM assigned_users WHERE email = ?';
    db.query(checkEmailSql, [email], async (err, emailResult) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (emailResult.length > 0) {
        return res.status(409).json({ 
          success: false, 
          message: 'A user with this email already exists' 
        });
      }

      // Get department ID
      const deptSql = 'SELECT id FROM departments WHERE name = ? OR name = ?';
      db.query(deptSql, [department, department + ' Engineering'], async (err, deptResult) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (deptResult.length === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'Department not found' 
          });
        }

        const departmentId = deptResult[0].id;

        // Get SC role ID
        const roleSql = 'SELECT id FROM roles WHERE role_name = ?';
        db.query(roleSql, ['Student Coordinator'], async (err, roleResult) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
          }

          if (roleResult.length === 0) {
            return res.status(404).json({ 
              success: false, 
              message: 'Student Coordinator role not found' 
            });
          }

          const roleId = roleResult[0].id;

          // Generate default password
          const defaultPassword = 'NSS@' + Math.random().toString(36).substring(2, 8).toUpperCase();
          const hashedPassword = await bcrypt.hash(defaultPassword, 10);

          // Generate login ID (email without domain)
          const loginId = email.split('@')[0];

          // Insert new SC
          const insertSql = `
            INSERT INTO assigned_users (name, email, login_id, password_hash, department_id, role_id, contact)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          
          db.query(insertSql, [name, email, loginId, hashedPassword, departmentId, roleId, contact || null], async (err, result) => {
            if (err) {
              return res.status(500).json({ success: false, message: 'Database error' });
            }

            const scId = result.insertId;
            
            const po = {
              name: req.user.name,
              email: req.user.email
            };

            let emailResult = { success: false };
            let notificationResult = { success: false };

            try {
              // Send welcome email to SC
              emailResult = await sendWelcomeEmail(
                email, 
                name, 
                po.name, 
                po.email, 
                department, 
                defaultPassword
              );
            } catch (emailError) {
              // Continue without failing the entire operation
            }

            try {
              // Send notification to PO
              notificationResult = await sendNotificationToPO(
                po.email,
                po.name,
                name,
                email,
                department
              );
            } catch (notificationError) {
              // Continue without failing the entire operation
            }
            
            res.status(201).json({ 
              success: true,
              message: 'Student Coordinator added successfully',
              sc: {
                id: scId,
                name,
                email,
                department,
                loginId,
                defaultPassword
              },
              emailSent: emailResult.success,
              notificationSent: notificationResult.success
            });
          });
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update Student Coordinator (PO only)
router.put('/student-coordinator/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, contact } = req.body;
  const poRole = req.user.role?.toLowerCase();

  // Allow both PO and PC to update SC
  if (poRole !== 'po' && poRole !== 'program officer' && poRole !== 'pc' && poRole !== 'program coordinator') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Only Program Officers and Program Coordinators can update Student Coordinators.' 
    });
  }

  // Validate required fields
  if (!name || !email || !contact) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required: name, email, contact' 
    });
  }

  try {
    // Check if email already exists for other users
    const checkEmailSql = 'SELECT id FROM assigned_users WHERE email = ? AND id != ?';
    db.query(checkEmailSql, [email, id], async (err, emailResult) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (emailResult.length > 0) {
        return res.status(409).json({ 
          success: false, 
          message: 'A user with this email already exists' 
        });
      }

      // Update SC
      const updateSql = `
        UPDATE assigned_users 
        SET name = ?, email = ?, login_id = ?, contact = ?
        WHERE id = ? AND role_id = (SELECT id FROM roles WHERE role_name = 'Student Coordinator')
      `;

      const loginId = email.split('@')[0];

      db.query(updateSql, [name, email, loginId, contact || null, id], async (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'Student Coordinator not found or access denied' 
          });
        }

        res.json({
          success: true,
          message: 'Student Coordinator updated successfully',
          sc: {
            id,
            name,
            email,
            loginId
          }
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Delete Student Coordinator (PO only)
router.delete('/student-coordinator/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const poRole = req.user.role?.toLowerCase();

  // Allow both PO and PC to delete SC
  if (poRole !== 'po' && poRole !== 'program officer' && poRole !== 'pc' && poRole !== 'program coordinator') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Only Program Officers and Program Coordinators can delete Student Coordinators.' 
    });
  }

  try {
    // Get SC details before deletion for confirmation
    const getScSql = `
      SELECT au.name, au.email, d.name as department_name
      FROM assigned_users au
      LEFT JOIN departments d ON au.department_id = d.id
      WHERE au.id = ? AND au.role_id = (SELECT id FROM roles WHERE role_name = 'Student Coordinator')
    `;

    db.query(getScSql, [id], async (err, scResult) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (scResult.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Student Coordinator not found' 
        });
      }

      const sc = scResult[0];

      // Delete working hours entries for this SC first
      const deleteWorkingHoursSql = `
        DELETE FROM working_hours 
        WHERE login_id = (SELECT login_id FROM assigned_users WHERE id = ?)
      `;

      db.query(deleteWorkingHoursSql, [id], async (err, workingHoursResult) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        // Delete SC
        const deleteSql = `
          DELETE FROM assigned_users 
          WHERE id = ? AND role_id = (SELECT id FROM roles WHERE role_name = 'Student Coordinator')
        `;

        db.query(deleteSql, [id], async (err, result) => {
              if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
              }
              
              if (result.affectedRows === 0) {
            return res.status(404).json({ 
              success: false, 
              message: 'Student Coordinator not found or access denied' 
            });
          }

          res.json({
            success: true,
            message: `Student Coordinator ${sc.name} has been deleted successfully`,
            deletedSc: sc,
            deletedWorkingHours: workingHoursResult.affectedRows || 0
          });
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get all Student Coordinators (for PO to see their SCs)
router.get('/student-coordinators', verifyToken, (req, res) => {
  const poId = req.user.id;
  const poRole = req.user.role?.toLowerCase();

  // Only PO can view their SCs
  if (poRole !== 'po' && poRole !== 'program officer') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Only Program Officers can view Student Coordinators.' 
    });
  }

  const sql = `
    SELECT au.id, au.name, au.email, au.contact, au.created_at, d.name as department_name
    FROM assigned_users au
    LEFT JOIN departments d ON au.department_id = d.id
    LEFT JOIN roles r ON au.role_id = r.id
    WHERE r.role_name = 'Student Coordinator' AND d.name = ?
    ORDER BY au.created_at DESC
  `;
  
  db.query(sql, [req.user.department], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
      }
      
      res.json({ 
      success: true,
      studentCoordinators: result
    });
  });
});

// Add Program Officer (PC only)
router.post('/users/program-officer', verifyToken, async (req, res) => {
  const { name, email, institute_id, department_id } = req.body;
  const pcRole = req.user.role?.toLowerCase();

  // Only PC can add PO
  if (pcRole !== 'pc' && pcRole !== 'program coordinator') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Only Program Coordinators can add Program Officers.' 
    });
  }

  // Validate required fields
  if (!name || !email || !institute_id || !department_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required: name, email, institute_id, department_id' 
    });
  }

  // Validate email format
  if (!validateEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email format. Please enter a valid email address.' 
    });
  }
  // Validate PO email domain (must end with @charusat.ac.in)
  if (req.path.includes('program-officer') && req.method === 'POST' && !validatePOEmail(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Program Officer email must end with @charusat.ac.in' 
    });
  }
  
  try {
    // Check if email already exists
    const checkEmailSql = 'SELECT id FROM assigned_users WHERE email = ?';
    db.query(checkEmailSql, [email], async (err, emailResult) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (emailResult.length > 0) {
        return res.status(409).json({ 
          success: false, 
          message: 'A user with this email already exists' 
        });
      }

      // Generate login ID (email without domain)
      const loginId = email.split('@')[0];

      // Check if login_id already exists (auto-generated from email)
      const checkLoginSql = 'SELECT id FROM assigned_users WHERE login_id = ?';
      db.query(checkLoginSql, [loginId], async (err, loginResult) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (loginResult.length > 0) {
          return res.status(409).json({ 
            success: false, 
            message: 'A user with this email already exists (login ID conflict)' 
          });
        }

        // Verify that the department belongs to the specified institute
        const verifyDeptSql = 'SELECT id FROM departments WHERE id = ? AND institute_id = ?';
        db.query(verifyDeptSql, [department_id, institute_id], async (err, deptResult) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
          }

          if (deptResult.length === 0) {
            return res.status(400).json({ 
              success: false, 
              message: 'Department does not belong to the specified institute' 
            });
          }

          // Get PO role ID
          const roleSql = 'SELECT id FROM roles WHERE role_name = ?';
          db.query(roleSql, ['Program Officer'], async (err, roleResult) => {
            if (err) {
              return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (roleResult.length === 0) {
              return res.status(404).json({ 
                success: false, 
                message: 'Program Officer role not found' 
              });
            }

            const roleId = roleResult[0].id;

            // Generate default password
            const defaultPassword = 'NSS@' + Math.random().toString(36).substring(2, 8).toUpperCase();
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);

            // Get institute and department names for email
            const getNamesSql = `
              SELECT i.name as institute_name, d.name as department_name 
              FROM institutes i 
              JOIN departments d ON d.institute_id = i.id 
              WHERE i.id = ? AND d.id = ?
            `;
            
            db.query(getNamesSql, [institute_id, department_id], async (err, namesResult) => {
              if (err) {
                return res.status(500).json({ success: false, message: 'Database error' });
              }

              if (namesResult.length === 0) {
                return res.status(404).json({ 
                  success: false, 
                  message: 'Institute or department not found' 
                });
              }

              const instituteName = namesResult[0].institute_name;
              const departmentName = namesResult[0].department_name;

              // Insert new PO (only department_id, not institute_id)
              const insertSql = `
                INSERT INTO assigned_users (name, email, login_id, password_hash, department_id, role_id, contact)
                VALUES (?, ?, ?, ?, ?, ?, ?)
              `;
              
              db.query(insertSql, [name, email, loginId, hashedPassword, department_id, roleId, null], async (err, result) => {
                if (err) {
                  return res.status(500).json({ success: false, message: 'Database error' });
                }

                const poId = result.insertId;
                
                const pc = {
                  name: req.user.name,
                  email: req.user.email
                };

                let emailResult = { success: false };
                let notificationResult = { success: false };

                try {
                  // Send welcome email to PO
                  emailResult = await sendWelcomeEmailToPO(
                    email, 
                    name, 
                    pc.name, 
                    pc.email, 
                    departmentName, 
                    instituteName, 
                    defaultPassword
                  );
                } catch (emailError) {
                  // Continue without failing the entire operation
                }

                try {
                  // Send notification to PC
                  notificationResult = await sendNotificationToPC(
                    pc.email,
                    pc.name,
                    name,
                    email,
                    departmentName,
                    instituteName
                  );
                } catch (notificationError) {
                  // Continue without failing the entire operation
                }
                
                res.status(201).json({ 
                  success: true,
                  message: 'Program Officer added successfully',
                  po: {
                    id: poId,
                    name,
                    email,
                    login_id: loginId,
                    department_id,
                    institute_name: instituteName,
                    department_name: departmentName,
                    defaultPassword
                  },
                  emailSent: emailResult.success,
                  notificationSent: notificationResult.success
                });
              });
            });
          });
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update Program Officer (PC only)
router.put('/users/program-officer/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, login_id, email, institute_id, department_id, password } = req.body;
  const pcRole = req.user.role?.toLowerCase();

  // Only PC can update PO
  if (pcRole !== 'pc' && pcRole !== 'program coordinator') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Only Program Coordinators can update Program Officers.' 
    });
  }

  // Validate required fields
  if (!name || !login_id || !email || !institute_id || !department_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required: name, login_id, email, institute_id, department_id' 
    });
  }

  try {
    // Check if email already exists for other users
    const checkEmailSql = 'SELECT id FROM assigned_users WHERE email = ? AND id != ?';
    db.query(checkEmailSql, [email, id], async (err, emailResult) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (emailResult.length > 0) {
        return res.status(409).json({ 
          success: false, 
          message: 'A user with this email already exists' 
        });
      }

      // Check if login_id already exists for other users
      const checkLoginSql = 'SELECT id FROM assigned_users WHERE login_id = ? AND id != ?';
      db.query(checkLoginSql, [login_id, id], async (err, loginResult) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (loginResult.length > 0) {
          return res.status(409).json({ 
            success: false, 
            message: 'A user with this login ID already exists' 
          });
        }

        // Verify that the department belongs to the specified institute
        const verifyDeptSql = 'SELECT id FROM departments WHERE id = ? AND institute_id = ?';
        db.query(verifyDeptSql, [department_id, institute_id], async (err, deptResult) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
          }

          if (deptResult.length === 0) {
            return res.status(400).json({ 
              success: false, 
              message: 'Department does not belong to the specified institute' 
            });
          }

          // Update PO (only department_id, not institute_id)
          let updateSql = `
            UPDATE assigned_users 
            SET name = ?, email = ?, login_id = ?, department_id = ?
          `;
          let updateValues = [name, email, login_id, department_id];

          // Add password update if provided
          if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateSql += `, password_hash = ?`;
            updateValues.push(hashedPassword);
          }

          updateSql += ` WHERE id = ? AND role_id = (SELECT id FROM roles WHERE role_name = 'Program Officer')`;
          updateValues.push(id);

          db.query(updateSql, updateValues, async (err, result) => {
            if (err) {
              return res.status(500).json({ success: false, message: 'Database error' });
            }

            if (result.affectedRows === 0) {
              return res.status(404).json({ 
                success: false, 
                message: 'Program Officer not found or access denied' 
              });
            }

            res.json({
              success: true,
              message: 'Program Officer updated successfully',
              po: {
                id,
                name,
                email,
                login_id,
                department_id
              }
            });
          });
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Delete Program Officer (PC only)
router.delete('/users/program-officer/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const pcRole = req.user.role?.toLowerCase();

  // Only PC can delete PO
  if (pcRole !== 'pc' && pcRole !== 'program coordinator') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Only Program Coordinators can delete Program Officers.' 
    });
  }

  try {
    // Get PO details before deletion
    const getPoSql = `
      SELECT au.name, au.email, d.name as department_name, i.name as institute_name
      FROM assigned_users au
      LEFT JOIN departments d ON au.department_id = d.id
      LEFT JOIN institutes i ON d.institute_id = i.id
      WHERE au.id = ? AND au.role_id = (SELECT id FROM roles WHERE role_name = 'Program Officer')
    `;
    
    db.query(getPoSql, [id], async (err, poResult) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (poResult.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'Program Officer not found' 
        });
      }

      const po = poResult[0];

      // Delete working hours entries for this PO first
      const deleteWorkingHoursSql = `
        DELETE FROM working_hours 
        WHERE login_id = (SELECT login_id FROM assigned_users WHERE id = ?)
      `;

      db.query(deleteWorkingHoursSql, [id], async (err, workingHoursResult) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        // Delete PO
        const deleteSql = `
          DELETE FROM assigned_users 
          WHERE id = ? AND role_id = (SELECT id FROM roles WHERE role_name = 'Program Officer')
        `;
        
        db.query(deleteSql, [id], async (err, result) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ 
              success: false, 
              message: 'Program Officer not found or access denied' 
            });
          }

          res.json({
            success: true,
            message: `Program Officer ${po.name} has been deleted successfully`,
            deletedPo: po,
            deletedWorkingHours: workingHoursResult.affectedRows || 0
          });
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Get users by role
router.get('/users/:role', verifyToken, (req, res) => {
  const roleName = decodeURIComponent(req.params.role);
  
  const sql = `
    SELECT au.*, r.role_name, d.name as department_name, i.name as institute_name
    FROM assigned_users au
    LEFT JOIN roles r ON au.role_id = r.id
    LEFT JOIN departments d ON au.department_id = d.id
    LEFT JOIN institutes i ON d.institute_id = i.id
    WHERE r.role_name = ?
    ORDER BY au.name
  `;

  db.query(sql, [roleName], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    res.json(result);
  });
});

// Get all institutes
router.get('/institutes', verifyToken, (req, res) => {
  const sql = 'SELECT * FROM institutes ORDER BY name';
  
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    res.json(result);
  });
});

// Get departments by institute
router.get('/departments/:instituteId', verifyToken, (req, res) => {
  const instituteId = req.params.instituteId;
  
  const sql = 'SELECT * FROM departments WHERE institute_id = ? ORDER BY name';
  
  db.query(sql, [instituteId], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    
    res.json(result);
  });
});

// Get user profile
router.get('/profile', verifyToken, (req, res) => {
  const userId = req.user.id;
  
  const sql = `
    SELECT au.*, r.role_name, d.name as department_name, i.name as institute_name
    FROM assigned_users au
    LEFT JOIN roles r ON au.role_id = r.id
    LEFT JOIN departments d ON au.department_id = d.id
    LEFT JOIN institutes i ON d.institute_id = i.id
    WHERE au.id = ?
  `;

  db.query(sql, [userId], (err, result) => {
      if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = result[0];
    res.json({
      id: user.id,
      name: user.name,
      login_id: user.login_id,
      email: user.email,
      contact: user.contact,
      role_id: user.role_id,
      role_name: user.role_name,
      department_id: user.department_id,
      department_name: user.department_name,
      institute: user.institute_name
            });
          });
        });

// Update password
router.put('/password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  // Validate required fields
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ 
      success: false, 
      message: 'Current password and new password are required' 
    });
  }

  // Validate new password length
  if (newPassword.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: 'New password must be at least 6 characters long' 
    });
  }

  try {
    // Get current user's password hash
    const getUserSql = 'SELECT password_hash FROM assigned_users WHERE id = ?';
    db.query(getUserSql, [userId], async (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (result.length === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }

      const user = result[0];

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'Current password is incorrect' 
        });
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      const updatePasswordSql = 'UPDATE assigned_users SET password_hash = ? WHERE id = ?';
      db.query(updatePasswordSql, [hashedNewPassword, userId], async (err, result) => {
        if (err) {
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ 
            success: false, 
            message: 'User not found' 
          });
        }

        res.json({ 
          success: true,
          message: 'Password updated successfully'
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update user profile
router.put('/profile', verifyToken, (req, res) => {
  const userId = req.user.id;
  const { name, email, login_id, contact } = req.body;
  const userRole = req.user.role?.toLowerCase();

  // Validate required fields
  if (!name || !email) {
    return res.status(400).json({ 
      success: false, 
      message: 'Name and email are required' 
    });
  }

  // Check if email already exists for other users
  const checkEmailSql = 'SELECT id FROM assigned_users WHERE email = ? AND id != ?';
  db.query(checkEmailSql, [email, userId], (err, emailResult) => {
      if (err) {
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (emailResult.length > 0) {
      return res.status(409).json({ 
        success: false, 
        message: 'A user with this email already exists' 
      });
    }

    // Update user profile - only include contact for SC users
    let updateSql = 'UPDATE assigned_users SET name = ?, email = ?, login_id = ?';
    let updateValues = [name, email, login_id];

    // Only include contact field for SC and PO users
    if (userRole === 'sc' || userRole === 'student coordinator' || userRole === 'po' || userRole === 'program officer') {
      updateSql += ', contact = ?';
      updateValues.push(contact);
    }

    updateSql += ' WHERE id = ?';
    updateValues.push(userId);

    db.query(updateSql, updateValues, (err, result) => {
          if (err) {
        return res.status(500).json({ success: false, message: 'Database error' });
          }
          
          if (result.affectedRows === 0) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      res.json({ 
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: userId,
          name,
          email,
          login_id,
          ...(userRole === 'sc' || userRole === 'student coordinator' || userRole === 'po' || userRole === 'program officer' ? { contact } : {})
        }
      });
    });
  });
});

module.exports = router;
