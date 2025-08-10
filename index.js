const functions = require('@google-cloud/functions-framework');
const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: '10.118.240.3',
  user: 'andy',
  password: 'Nescar88++', // You'll need to add the password here
  database: 'tareas', // You'll need to specify the database name
  port: 3306
};

// Function to insert record into email_task table
async function insertEmailTask() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const insertQuery = `
      INSERT INTO email_task VALUES (null, 'andy@andy.cl', 'test2', 'contenido prueba', 0, now(), NULL)
    `;
    
    const [result] = await connection.execute(insertQuery);
    
    console.log('Record inserted successfully:', result);
    await connection.end();
    
    return result;
  } catch (error) {
    console.error('Error inserting record v4:', error);
    throw error;
  }
}

functions.http('createSendEmailTask', async (req, res) => {
  try {
    // Insert the record directly into database
    const result = await insertEmailTask();
    
    res.status(200).json({
      success: true,
      message: 'Record inserted successfully',
      result: result
    });
  } catch (error) {
    console.error('Function error:', error);
    res.status(500).json({
      success: false,
      message: 'Error inserting record v3x:',
      error: error.message
    });
  }
});

// Export for testing
module.exports = { insertEmailTask };