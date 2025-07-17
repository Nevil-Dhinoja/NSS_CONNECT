# Email Setup Guide

## Prerequisites

1. Install nodemailer:
```bash
npm install nodemailer
```

2. Create a `.env` file in the server directory with the following variables:

```env
# Database Configuration
DB_HOST=172.16.11.213
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=nss_charusat

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Frontend URL
FRONTEND_URL=http://172.16.11.213:3000

# Server Port
PORT=5000
```

## Gmail Setup

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
   - Use this password in the `EMAIL_PASSWORD` variable

## Email Functionality

### When PO adds a new SC:

1. **Welcome Email to SC**: Contains login credentials and default password
2. **Notification Email to PO**: Confirms the SC was added successfully

### Email Templates

- **Welcome Email**: Professional template with NSS branding
- **Security Notice**: Reminds SC to change password after first login
- **Login Link**: Direct link to the dashboard

### Default Password Format

- Format: `NSS@XXXXXX` (where XXXXXX is a random 6-character string)
- Example: `NSS@ABC123`

## Security Features

- Passwords are hashed using bcrypt
- Default passwords are randomly generated
- Email includes security reminders
- Login ID is generated from email (username part)

## Testing

1. Start the server with email configuration
2. Login as a Program Officer
3. Navigate to "Student Coordinators" page
4. Add a new Student Coordinator
5. Check email inbox for welcome email

## Troubleshooting

- **Email not sending**: Check Gmail app password and 2FA settings
- **Authentication failed**: Verify EMAIL_USER and EMAIL_PASSWORD in .env
- **Email blocked**: Check Gmail security settings and allow less secure apps if needed 