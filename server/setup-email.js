const fs = require('fs');
const path = require('path');

// NSS Connect Email Setup
// ==========================

// To configure email functionality, follow these steps:

// 1. Enable 2-Factor Authentication on your Gmail account:
//    https://myaccount.google.com/security

// 2. Generate an App Password:
//    https://myaccount.google.com/apppasswords
//    - Select "Mail"
//    - Select your device or "Other"
//    - Copy the 16-character password

// 3. Create a .env file in the server directory with:
//    EMAIL_USER=your-email@gmail.com
//    EMAIL_PASSWORD=your-16-character-app-password

// 4. Or set environment variables when running the server:
//    EMAIL_USER=your-email@gmail.com EMAIL_PASSWORD=your-app-password node server.js

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('EMAIL_USER') && envContent.includes('EMAIL_PASSWORD')) {
    // .env file found and email variables are configured
  } else {
    // .env file exists but email variables may be missing
  }
} else {
  // .env file not found
  // Create a .env file in the server directory with your email credentials
}

// Example .env file content:
// EMAIL_USER=d24dce147@charusat.edu.in
// EMAIL_PASSWORD=abcd efgh ijkl mnop
// FRONTEND_URL=http://172.16.11.213:3000 