const express = require('express');
const app = express();
const PORT = 3333;

console.log('Starting minimal test server...');

app.get('/', (req, res) => {
  console.log('Request received!');
  res.send('Hello World!');
});

app.listen(PORT, (err) => {
  if (err) {
    console.error('Error starting server:', err);
    return;
  }
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Server started successfully!');
});

console.log('Script executed');
