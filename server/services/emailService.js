const nodemailer = require('nodemailer');

// Email validation function
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate PO email (must end with @charusat.ac.in)
const validatePOEmail = (email) => {
  const emailRegex = /^[^\s@]+@charusat\.ac\.in$/;
  return emailRegex.test(email);
};

// Validate SC/Volunteer email (must end with @charusat.edu.in)
const validateSCEmail = (email) => {
  const emailRegex = /^[^\s@]+@charusat\.edu\.in$/;
  return emailRegex.test(email);
};

// Function to check if email exists in database
const checkEmailExists = async (email) => {
  return new Promise((resolve, reject) => {
    const db = require('../db');
    const sql = 'SELECT id FROM assigned_users WHERE email = ?';
    db.query(sql, [email], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.length > 0);
      }
    });
  });
};

// Function to get PC email from database
const getPCEmail = async () => {
  return new Promise((resolve, reject) => {
    const db = require('../db');
    const sql = `
      SELECT email FROM assigned_users 
      WHERE role_id = (SELECT id FROM roles WHERE role_name = 'Program Coordinator') 
      LIMIT 1
    `;
    db.query(sql, [], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.length > 0 ? result[0].email : 'nss.pc@charusat.ac.in');
      }
    });
  });
};

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Check if email credentials are configured
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  // Email credentials not configured
} else {
  // Email service configured successfully
}

// Test email configuration
transporter.verify(function(error, success) {
  if (error) {
    // Email service configuration error
  } else {
    // Email service configured successfully
  }
});

// Test on startup
// testEmailConfig(); // This line is removed as per the new_code

// Function to send welcome email to new SC
const sendWelcomeEmail = async (scEmail, scName, poName, poEmail, department, defaultPassword) => {
  try {
    // Validate email format
    if (!validateEmail(scEmail)) {
      return { success: false, error: 'Invalid email format' };
    }

    // Check if email exists in database (optional validation)
    try {
      const emailExists = await checkEmailExists(scEmail);
      if (emailExists) {
        // Email already exists
      }
    } catch (error) {
      // Could not validate email existence
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: scEmail,
      subject: 'Welcome to NSS Connect - Student Coordinator Account Created',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">NSS Connect</h1>
            <p style="margin: 10px 0 0 0;">National Service Scheme</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1e40af; margin-bottom: 20px;">Welcome to NSS Connect!</h2>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              Dear <strong>${scName}</strong>,
            </p>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              Your Student Coordinator account has been successfully created by <strong>${poName}</strong> 
              for the <strong>${department}</strong> department.
            </p>
            
            <div style="background-color: #dbeafe; border-left: 4px solid #1e40af; padding: 15px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin: 0 0 10px 0;">Your Login Credentials:</h3>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${scEmail}</p>
              <p style="margin: 5px 0;"><strong>Login ID:</strong> ${scEmail.split('@')[0]}</p>
              <p style="margin: 5px 0;"><strong>Default Password:</strong> ${defaultPassword}</p>
            </div>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              <strong>Important:</strong> Please change your password after your first login for security purposes.
            </p>
            
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 4px; padding: 15px; margin: 20px 0;">
              <h4 style="color: #92400e; margin: 0 0 10px 0;">🔐 Security Notice:</h4>
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                For your account security, please change your password immediately after logging in for the first time.
              </p>
            </div>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              You can now access the NSS Connect dashboard to manage volunteers, events, and working hours for your department.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/login" 
                 style="background-color: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Login to Dashboard
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 0;">
              If you have any questions, please contact your Program Officer: ${poEmail}
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Function to send notification email to PO when SC is added
const sendNotificationToPO = async (poEmail, poName, scName, scEmail, department) => {
  try {
    // Validate email format
    if (!validateEmail(poEmail)) {
      return { success: false, error: 'Invalid email format' };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: poEmail,
      subject: 'NSS Connect - New Student Coordinator Added',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">NSS Connect</h1>
            <p style="margin: 10px 0 0 0;">National Service Scheme</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #059669; margin-bottom: 20px;">Student Coordinator Added Successfully</h2>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              Dear <strong>${poName}</strong>,
            </p>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              A new Student Coordinator has been successfully added to your department.
            </p>
            
            <div style="background-color: #d1fae5; border-left: 4px solid #059669; padding: 15px; margin: 20px 0;">
              <h3 style="color: #059669; margin: 0 0 10px 0;">New Student Coordinator Details:</h3>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${scName}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${scEmail}</p>
              <p style="margin: 5px 0;"><strong>Department:</strong> ${department}</p>
            </div>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              The Student Coordinator has been sent a welcome email with their login credentials.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard" 
                 style="background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 0;">
              This is an automated notification from NSS Connect system.
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Function to send welcome email to new PO
const sendWelcomeEmailToPO = async (poEmail, poName, pcName, pcEmail, department, institute, defaultPassword) => {
  try {
    // Validate email format
    if (!validateEmail(poEmail)) {
      return { success: false, error: 'Invalid email format' };
    }

    // Check if email exists in database (optional validation)
    try {
      const emailExists = await checkEmailExists(poEmail);
      if (emailExists) {
        // Email already exists
      }
    } catch (error) {
      // Could not validate email existence
    }

    // Check if this is a test email (dummy email)
    if (poEmail.includes('dummy') || poEmail.includes('test') || !poEmail.includes('@')) {
      return { success: true, messageId: 'test-email-id' };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: poEmail,
      subject: 'Welcome to NSS Connect - Program Officer Account Created',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">NSS Connect</h1>
            <p style="margin: 10px 0 0 0;">National Service Scheme</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #1e40af; margin-bottom: 20px;">Welcome to NSS Connect!</h2>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              Dear <strong>${poName}</strong>,
            </p>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              Your Program Officer account has been successfully created by <strong>${pcName}</strong> 
              for the <strong>${department}</strong> department at <strong>${institute}</strong>.
            </p>
            
            <div style="background-color: #dbeafe; border-left: 4px solid #1e40af; padding: 15px; margin: 20px 0;">
              <h3 style="color: #1e40af; margin: 0 0 10px 0;">Your Login Credentials:</h3>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${poEmail}</p>
              <p style="margin: 5px 0;"><strong>Login ID:</strong> ${poEmail.split('@')[0]}</p>
              <p style="margin: 5px 0;"><strong>Default Password:</strong> ${defaultPassword}</p>
            </div>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              <strong>Important:</strong> Please change your password after your first login for security purposes.
            </p>
            
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 4px; padding: 15px; margin: 20px 0;">
              <h4 style="color: #92400e; margin: 0 0 10px 0;">🔐 Security Notice:</h4>
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                For your account security, please change your password immediately after logging in for the first time.
              </p>
            </div>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              You can now access the NSS Connect dashboard to manage Student Coordinators, volunteers, events, and working hours for your department.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/login" 
                 style="background-color: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Login to Dashboard
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 0;">
              If you have any questions, please contact your Program Coordinator: ${pcEmail}
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Function to send notification email to PC when PO is added
const sendNotificationToPC = async (pcEmail, pcName, poName, poEmail, department, institute) => {
  try {
    // Get PC email from database if not provided
    let actualPcEmail = pcEmail;
    if (!pcEmail || pcEmail.includes('dummy') || pcEmail.includes('test')) {
      try {
        actualPcEmail = await getPCEmail();
      } catch (error) {
        actualPcEmail = 'nss.pc@charusat.ac.in';
      }
    }

    // Validate email format
    if (!validateEmail(actualPcEmail)) {
      return { success: false, error: 'Invalid PC email format' };
    }

    // Check if this is a test email (dummy email)
    if (actualPcEmail.includes('dummy') || actualPcEmail.includes('test') || !actualPcEmail.includes('@')) {
      return { success: true, messageId: 'test-email-id' };
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: actualPcEmail,
      subject: 'NSS Connect - New Program Officer Added',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0;">NSS Connect</h1>
            <p style="margin: 10px 0 0 0;">National Service Scheme</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #059669; margin-bottom: 20px;">Program Officer Added Successfully</h2>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              Dear <strong>${pcName}</strong>,
            </p>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              A new Program Officer has been successfully added to your institute.
            </p>
            
            <div style="background-color: #d1fae5; border-left: 4px solid #059669; padding: 15px; margin: 20px 0;">
              <h3 style="color: #059669; margin: 0 0 10px 0;">New Program Officer Details:</h3>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${poName}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${poEmail}</p>
              <p style="margin: 5px 0;"><strong>Department:</strong> ${department}</p>
              <p style="margin: 5px 0;"><strong>Institute:</strong> ${institute}</p>
            </div>
            
            <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
              The Program Officer has been sent a welcome email with their login credentials.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/dashboard" 
                 style="background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Go to Dashboard
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 0;">
              This is an automated notification from NSS Connect system.
            </p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendNotificationToPO,
  sendWelcomeEmailToPO,
  sendNotificationToPC,
  validateEmail,
  validatePOEmail,
  validateSCEmail,
  checkEmailExists
}; 