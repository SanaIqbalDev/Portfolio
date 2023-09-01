const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware for parsing JSON in requests

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


// Define a POST endpoint to receive data from the client
app.post('/api/insertData', (req, res) => {
    const data = req.body; // Data sent from the client
  
    // Perform database insertion or any other desired operation
    // Example: Insert 'data' into your PostgreSQL database
  
    // Respond to the client
    res.status(200).json({ message: 'Data inserted successfully' });
  });

  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
