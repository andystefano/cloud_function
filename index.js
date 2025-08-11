const functions = require('@google-cloud/functions-framework');
const mysql = require('mysql2/promise');
const {PubSub} = require('@google-cloud/pubsub');

// Database Configuration
const dbConfig = {
  host: '10.118.240.3',
  user: 'andy',
  password: 'Nescar88++', // You'll need to add the password here
  database: 'tareas', // You'll need to specify the database name
  port: 3306
};

// Pub/Sub configuration
const pubsub = new PubSub();
const topicName = 'create-email-task';

// Function to insert record into email_task table
async function insertEmailTask() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const insertQuery = `
      INSERT INTO email_task VALUES (null, 'andy@andy.cl', 'test2',     CONCAT('contenido prueba ', MD5(RAND())), 0, now(), NULL)
    `;
    
    const [result] = await connection.execute(insertQuery);
    
    // Store the inserted ID in id_email variable
    const id_email = result.insertId;
    
    console.log('Record inserted successfully:', result);
    console.log('ID del email insertado:', id_email);
    
    await connection.end();
    
    return { result, id_email };
  } catch (error) {
    console.error('Error inserting record vpc4:', error);
    throw error;
  }
}

// Function to publish message to Pub/Sub topic
async function publishToPubSub(idEmailTask) {
  try {
    const message = {
      idEmailTask: idEmailTask
    };
    
    const messageBuffer = Buffer.from(JSON.stringify(message), 'utf8');
    const messageId = await pubsub.topic(topicName).publish(messageBuffer);
    
    console.log(`Message ${messageId} published to topic ${topicName}`);
    return messageId;
  } catch (error) {
    console.error('Error publishing to Pub/Sub:', error);
    throw error;
  }
}

functions.http('createSendEmailTask', async (req, res) => {
  try {
    // Insert the record directly into database
    const { result, id_email } = await insertEmailTask();
    
    // Publish the ID to Pub/Sub topic
    const messageId = await publishToPubSub(id_email);
    
    res.status(200).json({
      success: true,
      message: 'Record inserted successfully and published to Pub/Sub',
      result: result,
      id_email: id_email,
      pubsub_message_id: messageId
    });
  } catch (error) {
    console.error('Function error:', error);
    res.status(500).json({
      success: false,
      message: 'Error inserting record vpc3x:',
      error: error.message
    });
  }
});

// Export for testing
module.exports = { insertEmailTask, publishToPubSub };