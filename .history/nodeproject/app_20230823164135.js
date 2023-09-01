const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Import the 'cors' middleware
const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Middleware for parsing JSON in requests


const pool = new Pool({
  user: 'dev',
  host: 'localhost',
  database: 'portfolio',
  password: 'password',
  port: 5432, // PostgreSQL default port
});


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// route to fetch all entries from person table
app.get('/api/getAllPersons', (req, res) => {
  // Define the SQL query to select all entries from the database table
  const selectQuery = 'SELECT * FROM PERSON;'; // Replace with your table name

  // Execute the SQL query using the PostgreSQL Pool
  pool.query(selectQuery, (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // Data was successfully fetched, and the result contains the selected data
      console.log('Data fetched successfully:', result.rows);
      res.status(200).json(result.rows);
    }
  });
});


// route to fetch all entries related to work experience
app.get('/api/getWorkExp', async (req,res) => {


  const query = `
  SELECT p.project_id, p.project_name, pd.detail_text
  FROM PROJECT p
  LEFT JOIN PROJECT_DETAIL pd ON p.project_id = pd.project_id
`;

pool.query(query, (error, result) => {
  if (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  } else {
    // Data was successfully fetched, and the result contains the selected data
    console.log('Data fetched successfully:', result.rows);
    res.status(200).json(result.rows);
  }
});
});



// Create an endpoint to handle POST requests
app.post('/api/addService', async (req, res) => {
  const { title, description, image_url } = req.body;

  try {
    const query = {
      text: 'INSERT INTO SERVICES (title, description, image_url) VALUES ($1, $2, $3) RETURNING *',
      values: [title, description, image_url],
    };

    const result = await pool.query(query);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Define a POST endpoint to receive data from the client
app.post('/api/insertperson', (req, res) => {
    const data = req.body; // Data sent from the client
  
  // Define the SQL query to insert the data into your database table
  const insertQuery = `
    INSERT INTO PERSON (intro,name,designation,linkedin,contact,email,picture) 
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *;`;

  // Define the values to be inserted
  const values = [data.value1, data.value2,data.value3,data.value4,data.value5,data.value6,data.value7];

  // Execute the SQL query using the PostgreSQL Pool
  pool.query(insertQuery, values, (error, result) => {
    if (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log('Data inserted successfully:', result.rows[0]);
      res.status(200).json({ message: 'Data inserted successfully' });
    }

    // Respond to the client
    res.status(200).json({ message: 'Data inserted successfully' });
  });
});
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
