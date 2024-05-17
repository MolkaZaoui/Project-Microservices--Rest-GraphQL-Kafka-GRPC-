// Import the Kafka class from the 'kafkajs' module
const { Kafka } = require('kafkajs');

// Create a new instance of Kafka with client and broker configuration
const kafka = new Kafka({
  clientId: 'restaurant-system', // Client identifier for Kafka connection
  brokers: ['localhost:9092'] // Array of Kafka broker endpoints
});

// Create a Kafka consumer instance with group configuration
const consumer = kafka.consumer({ groupId: 'my-group' });

// Define an asynchronous function to run the Kafka consumer
const consumeMessages = async () => {
  try {
    // Connect the consumer to the Kafka cluster
    await consumer.connect();

    // Subscribe the consumer to a specific topic with option to read from the beginning
    await consumer.subscribe({ topic: 'reservation-topic', fromBeginning: true });

    // Start consuming messages from the subscribed topic
    await consumer.run({
      // Define the callback function to handle each consumed message
      eachMessage: async ({ topic, partition, message }) => {
        // Log the value of the consumed message
        console.log(`Received message: ${message.value.toString()}`);
        // Additional logic to process message
      }
    });
  } catch (error) {
    console.error('Failed to start Kafka Consumer:', error.message);
    process.exit(1); // Exit the process with a non-zero exit code to indicate failure
  }
};

module.exports = { consumeMessages };
