const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the /public directory
app.use(express.static(path.join(__dirname, 'public')));

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/lcars', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index-lcars.html'));
});

app.get('/round-robin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index-round-robin.html'));
});

// Start the server
var port = process.env.PORT || 3000; // Use the port that Heroku provides or default to 5000
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});