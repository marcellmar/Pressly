const fs = require('fs');
const path = require('path');

// Read the producers.js file
const producersFilePath = path.join(__dirname, 'src', 'pages', 'Producers.js');
const producersFileContent = fs.readFileSync(producersFilePath, 'utf8');

// Read the Producers.js file and create a simple version that works on its own
const simpleVersion = `
import React from 'react';
import ReactDOM from 'react-dom';
import './standalone.css';

${producersFileContent}

// Render the Producers component directly
ReactDOM.render(
  <React.StrictMode>
    <Producers />
  </React.StrictMode>,
  document.getElementById('root')
);
`;

// Create a simple HTML file
const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Pressly - Producers Page</title>
</head>
<body>
  <div id="root"></div>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="producers_standalone.js"></script>
</body>
</html>
`;

// Create a simple CSS file that has the basic styles
const cssContent = `
/* Base styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Additional styles from the mockup */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  font-weight: 500;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #d1d5db;
  color: #4b5563;
}

.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-primary {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-secondary {
  background-color: #d1fae5;
  color: #065f46;
}

.badge-outline {
  background-color: transparent;
  border: 1px solid #d1d5db;
  color: #4b5563;
}
`;

// Write the files
fs.writeFileSync(path.join(__dirname, 'producers_standalone.html'), htmlContent);
fs.writeFileSync(path.join(__dirname, 'standalone.css'), cssContent);

console.log('Files created successfully!');