# NSS CHARUSAT Client

This is the frontend client application for the NSS CHARUSAT project.

## Security Improvements Made

### 1. Console Log Removal
- Removed all `console.log` statements from the codebase
- Commented out debug console.error statements
- Cleaned up any remaining debugging code

### 2. Data Leak Prevention
- Replaced hardcoded URLs with environment variables
- Updated `LoginPage.jsx` to use `process.env.REACT_APP_DASHBOARD_URL`
- Updated `EventPage.jsx` to use `process.env.REACT_APP_DRIVE_LINK`
- Removed any hardcoded API endpoints

### 3. Environment Variables
Create a `.env` file in the client directory with the following variables:
```
REACT_APP_DASHBOARD_URL=http://172.16.11.213:8080/
REACT_APP_DRIVE_LINK=https://drive.google.com/drive/folders/1zbPXPL_5Eh6O0j4-vXirgdYDpAgVHX0T
REACT_APP_API_BASE_URL=http://172.16.11.213:5000/api
```

## CSS Improvements

### 1. Responsive Design
- Fixed modal positioning and sizing
- Improved grid layouts for better mobile experience
- Enhanced button hover effects
- Optimized image display with proper object-fit

### 2. Performance Optimizations
- Removed redundant CSS rules
- Consolidated media queries
- Improved transition animations
- Better box-shadow and transform effects

### 3. Layout Fixes
- Fixed modal overlay positioning
- Improved container max-widths
- Better spacing and padding
- Enhanced accessibility with proper focus states

## File Structure

```
client/
├── src/
│   ├── components/          # Reusable UI components
│   ├── components2/         # Additional components
│   ├── MainPart/           # Main application pages
│   ├── assets/             # Images and static files
│   ├── App.jsx             # Main App component
│   └── main.jsx            # Application entry point
├── public/                 # Public assets
├── index.html              # HTML template
└── package.json            # Dependencies
```

## Key Components

### LoginPage.jsx
- Handles user authentication
- Redirects to dashboard after successful login
- Uses environment variables for URLs

### EventPage.jsx
- Displays events and initiatives
- Modal popup for image galleries
- Responsive grid layout

### MainPart.css
- Main stylesheet with responsive design
- Modal and overlay styles
- Grid and flexbox layouts

## Security Best Practices

1. **No Hardcoded Credentials**: All sensitive URLs are now environment variables
2. **Input Validation**: Password fields are properly handled
3. **XSS Prevention**: No innerHTML usage found
4. **Error Handling**: Proper error boundaries and user feedback
5. **Console Cleanup**: Removed all debug logging

## Development

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Notes

- Images are optimized with proper sizing
- CSS animations are hardware accelerated
- Modal overlays use efficient positioning
- Responsive design works across all screen sizes

## Security Checklist

- [x] Removed all console.log statements
- [x] Replaced hardcoded URLs with environment variables
- [x] No hardcoded credentials found
- [x] Input fields properly sanitized
- [x] No innerHTML usage
- [x] Proper error handling implemented
- [x] CSS optimized for performance
- [x] Responsive design implemented
- [x] Accessibility improvements made 