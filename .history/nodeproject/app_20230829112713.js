const express = require('express');
const { Pool } = require('pg');

const cors = require('cors'); // Import the 'cors' middleware
const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: 'http://127.0.0.1:5500', })); // Middleware for parsing JSON in requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Create a storage engine that specifies where to store uploaded files.
// const storage = multer.memoryStorage(); // Stores files in memory (use diskStorage for file system storage)

// Create a multer instance and configure it with the storage engine.
// const upload = multer({ dest: 'uploads/', storage });

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

app.get('/api/getSkills',(req,res) => {
  const selectQuery = 'select * from skills;';

  pool.query(selectQuery,(error,result) => {
    if (error) {
      console.error('Error fetching person data:', error);
      res.setHeader('Access-Control-Allow-Origin', '*').status(500).json({ error: 'Internal server error' });
    } else {
      // Data was successfully fetched, and the result contains the selected data
      res.setHeader('Access-Control-Allow-Origin', '*').status(200).json(result.rows);
    }
  });
});

app.get('/api/getInformationData',(req,res) => {
  const selectQuery = 'select * from information order by info_id ASC;';

  pool.query(selectQuery,(error,result) => {
    if(error){
      console.error('Error fetching person data:', error);
      res.setHeader('Access-Control-Allow-Origin', '*').status(500).json({ error: 'Internal server error' });
    } else {
      // Data was successfully fetched, and the result contains the selected data
      res.setHeader('Access-Control-Allow-Origin', '*').status(200).json(result.rows);
    }
  })
})



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
app.post('/api/addService', async(req, res) => {
  const {service_id, title, description,image_url} = req.body;

  console.log('request body data:', req.body);

  const query = 'INSERT INTO SERVICE (service_id, title, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [service_id, title, description, image_url];

  console.log('Received data:', values); 


  pool.query(query,values, (error, result) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    else {
      res.status(201).json({ message: 'Service added successfully', data: result.rows[0]});
    }
  });

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


//Deleting service entry with the given serviec_id info.
app.delete('/api/deleteInformationItem/:id', async (req, res) => {
  const itemIdToDelete = parseInt(req.params.id);

  console.log("Item to delete", itemIdToDelete);
  if (isNaN(itemIdToDelete)) {
    return res.status(400).json({ error: 'Invalid information ID' });
  }
  try {
    const deleteQuery = `DELETE FROM information WHERE info_id = $1;`;
    const values = [itemIdToDelete];
    const result = await pool.query(deleteQuery, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    console.log('Item deleted successfully');
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('could not delete info item:', error);
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

  const query = `UPDATE SERVICE SET title = $1, description = $2, image_url = $3 WHERE service_id = $4 RETURNING *;`;
  const values = [
    serviceItemData.title,
    serviceItemData.description,
    serviceItemData.image_url,
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
    // res.status(200).json(result.rows);


  });
});

//Add skill item...
app.post('/api/addSkill', (req, res) => {
  const { id, skill_name } = req.body;

  const insertQuery = 'INSERT INTO SKILLS (skill_id, skill_name) VALUES ($1,$2) RETURNING *;';
  const values = [id,skill_name];

  pool.query(insertQuery, values, (error, result) => {
    if (error) {
      console.error('Error inserting skill:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      console.log('Skill inserted successfully:', result.rows[0]);
      res.status(201).json(result.rows[0]);
    }
  });
});
app.delete('/api/deleteSkill/:skillId', (req, res) => {
  const skillId = req.params.skillId;

  console.log("delete the skill with id : ",skillId)
  const deleteQuery = 'DELETE FROM SKILLS WHERE skill_id = $1 RETURNING *;';
  const values = [skillId];

  pool.query(deleteQuery, values, (error, result) => {
    if (error) {
      console.error('Error deleting skill:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else if (result.rowCount === 0) {
      res.status(404).json({ message: 'Skill not found' });
    } else {
      console.log('Skill deleted successfully:', result.rows[0]);
      res.status(200).json(result.rows[0]);
    }
  });
});

//Adding items in information table...

app.post('/api/addInformationData', (req,res) => {
  const items = req.body;

  // Define the SQL query to insert multiple items into the database
  const insertQuery = `
    INSERT INTO information (info_id, image_url, image_title)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  // Use Promise.all to insert all items in parallel
  Promise.all(
    items.map(item => {
      const values = [item.id, item.url, item.title];
      return pool.query(insertQuery, values);
    })
  )
    .then(results => {
      // Send a success response with the inserted items
      const insertedItems = results.map(result => result.rows[0]);
      res.status(201).json(insertedItems);
    })
    .catch(error => {
      console.error('Error inserting items:', error);
      res.status(500).json({ error: 'Internal server error' });
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
