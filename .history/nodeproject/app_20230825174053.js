const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Import the 'cors' middleware
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'http://127.0.0.1:5500', })); // Middleware for parsing JSON in requests
app.use(express.json());


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
      console.error('Error fetching person data:', error);
      res.setHeader('Access-Control-Allow-Origin', '*').status(500).json({ error: 'Internal server error' });
    } else {
      // Data was successfully fetched, and the result contains the selected data
      res.setHeader('Access-Control-Allow-Origin', '*').status(200).json(result.rows);
    }
    // res.setHeader('Access-Control-Allow-Origin','*');
  });
});


// route to fetch all entries related to work experience
app.get('/api/getWorkExp', async (req, res) => {


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
      // console.log('Data fetched successfully:', result.rows);
      res.status(200).json(result.rows);
    }
  });
});


//Fetch initial services data.
app.get('/api/getServices', async (req, res) => {

  const query = 'SELECT service_id,title,image_url FROM SERVICE;';

  pool.query(query, (error, result) => {
    if (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    else {
      // console.log('Data fetched successfully:', result.rows);
      res.status(200).json(result.rows);
    }
  })

});


//Adding new service item in database.
app.post('/api/addService', async (req, res) => {
  // const data = req.body;

  const {title, description, image} = req.body;

  // Convert image data to a buffer if it's provided as a base64 string
  // const imageBuffer = Buffer.from(image, 'base64');


  const query = `INSERT INTO SERVICE (title, description, image_url) VALUES ($1, $2, $3) RETURNING *;`;
  const values = [title, description, image];

  pool.query(query,values,(error,result) => {

    if(error){
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    else{
      res.status(200).json(result.rows);
    }
    // if (result.rowCount === 1) {
    //   res.setHeader('Access-Control-Allow-Origin', '*').status(201).json(result.rows[0]);
    // } else {
    //   res.setHeader('Access-Control-Allow-Origin', '*').status(400).json({ error: 'Could not add service' });
    // }
  })


  // const result = await pool.query(query, values);

  // if (result.rowCount === 1) {
  //   res.setHeader('Access-Control-Allow-Origin', '*').status(201).json(result.rows[0]);
  // } else {
  //   res.setHeader('Access-Control-Allow-Origin', '*').status(400).json({ error: 'Could not add service' });
  // }
});


//Deleting service entry with the given serviec_id info.
app.delete('/api/deleteServiceItem/:service_id', async (req, res) => {
  const itemIdToDelete = parseInt(req.params.service_id);

  console.log("Item to delete", itemIdToDelete);
  if (isNaN(itemIdToDelete)) {
    return res.status(400).json({ error: 'Invalid service ID' });
  }
  try {
    const deleteQuery = `DELETE FROM SERVICE WHERE service_id = $1;`;
    const values = [itemIdToDelete];
    const result = await pool.query(deleteQuery, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/getServiceItem/:service_id', async (req, res) => {

  const itemToSelect = req.params.service_id;

  try {
    const getQuery = `SELECT title,description,image_url FROM SERVICE WHERE service_id = $1;`;
    const values = [itemToSelect];
    const result = await pool.query(getQuery, values);

    if (result.rowCount === 0) {
      console.log("Fetched service data is not found");
      return res.status(404).json({ error: 'Item not found' });
    }
    console.log("Fetched service data is:", result.rows);

    res.status(200).json(result.rows);
  }
  catch (error) {

    console.error("Error: ", error);
    res.status(500).json({ error: 'Internal server error' });

  }
});

//updating services item.
app.put('/api/updateServiceItem', async (req, res) => {
  const serviceItemData = req.body;

  const query = `UPDATE SERVICE SET title = $1, description = $2 WHERE service_id = $3 RETURNING *;`;
  const values = [
    serviceItemData.title,
    serviceItemData.description,
    serviceItemData.service_id,
  ];

  pool.query(query, values, (error, result) => {

    if (error) {
      console.error('Error updating service data:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.error('updated service data:', result);
      if (result.rowCount === 1) {
        console.log('Data updated successfully:', result.rows[0]);
        res.status(200).json(result.rows);
      }

    }
    res.status(200).json(result.rows);


  });
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
  const values = [data.value1, data.value2, data.value3, data.value4, data.value5, data.value6, data.value7];

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
app.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.url}`);
  next();
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
