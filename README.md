# HCEN Frontend

Frontend application for the HCEN (Historia Clínica Electrónica Nacional) platform.

## Overview

This React application provides the user interface for the HCEN platform, starting with a login page that matches the design specifications and color palette provided.

## Features

- **Login Page**: Clean and modern login interface with form validation
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Color Palette**: Uses the specified HCEN color scheme:
  - Mint Green: #BEE9E8
  - Moonstone: #62B6CB
  - Indigo Dye: #1B4965
  - Columbia Blue: #CAE9FF
  - Picton Blue: #5FA8D3

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Login.js          # Login page component
│   └── Login.css         # Login page styles
├── App.js               # Main application component
├── App.css              # Application styles
├── index.js             # Application entry point
└── index.css            # Global styles
```

## Current Implementation

The login page includes:
- HCEN logo with stylized icon
- Username and password input fields
- Login button (currently non-functional as requested)
- "Forgot Password" link
- Responsive design for all screen sizes
- Footer with copyright information

## Future Development

This is the initial skeleton of the application. Future features will include:
- Authentication logic integration
- Dashboard for different user types
- Integration with HCEN backend services
- Additional pages for the complete platform functionality

## Technologies Used

- React 18
- React Router DOM
- CSS3 with CSS Variables
- Modern JavaScript (ES6+)
