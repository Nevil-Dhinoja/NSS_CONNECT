const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = (req, res) => {
    const { login_id, password, role } = req.body;


    const sql = `SELECT assigned_users.*, roles.role_name, departments.name as department_name
                 FROM assigned_users 
                 JOIN roles ON assigned_users.role_id = roles.id 
                 LEFT JOIN departments ON assigned_users.department_id = departments.id
                 WHERE assigned_users.login_id = ?`;

    db.query(sql, [login_id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        if (result.length === 0) return res.status(401).json({ success: false, message: 'User not found' });

        const user = result[0];
    

        // Validate that the user's actual role matches the selected role
        // Handle both full role names and abbreviations
        const roleMap = {
            'PO': 'Program Officer',
            'PC': 'Program Coordinator', 
            'SC': 'Student Coordinator',
            'HSC': 'Head Student Coordinator'
        };
        
        const expectedRole = roleMap[role] || role;
        
        if (role && user.role_name !== expectedRole) {
    
            return res.status(401).json({ 
                success: false, 
                message: `Access denied. You are registered as ${user.role_name}, not ${role}. Please select the correct role.` 
            });
        }

        bcrypt.compare(password, user.password_hash, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error checking password' });

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid password' });
            }

            const token = jwt.sign({ id: user.id, role: user.role_name }, process.env.JWT_SECRET, {
                expiresIn: '30m'
            });

        

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    role: user.role_name,
                    department_id: user.department_id,
                    department: user.department_name
                }
            });
        });
    });
};