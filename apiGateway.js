const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const connectDB = require('./database');
const resolvers = require('./graphQL/resolvers');
const typeDefs = require('./graphQL/schema');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const  sendMessage= require('./kafka/kafkaConsumer');
const User=require('./user/user');



// Initialize Express application
const app = express();
// Connect to the database
connectDB();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON requests

// Load Protos
const userProtoPath = __dirname + '/user/user.proto';
const userPackageDefinition = protoLoader.loadSync(userProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// Create a gRPC client for the User service
const userProto = grpc.loadPackageDefinition(userPackageDefinition).user;

const userClient = new userProto.UserService('localhost:50053', grpc.credentials.createInsecure());

// REST Endpoints for User

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST method to create a user
app.post('/users', async (req, res) => {
  try {
    const { name, email,role } = req.body;
    const user = new User({ name, email,role });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*app.put('/user/:id', (req, res) => {
  const updatedUser = { ...req.body, id: req.params.id };
  userClient.UpdateUser(updatedUser, async (error, response) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      await sendMessage('user-events', `User updated: ${response.name}`);
      res.send(response);
    }
  });
});*/

/*app.delete('/user/:id', (req, res) => {
  userClient.DeleteUser({ id: req.params.id }, async (error, response) => {
    if (error) {
      res.status(500).send(error.message);
    } else {
      await sendMessage('user-events', `User deleted: ${response.name}`);
      res.send(response);
    }
  });
});*/

// GraphQL Endpoint setup
const server = new ApolloServer({ typeDefs, resolvers });

// Start the Apollo Server and apply middleware to Express
(async () => {
  await server.start();
  server.applyMiddleware({ app });
})();

// Start the Express server
const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
  console.log(`GraphQL endpoint available at http://localhost:${port}${server.graphqlPath}`);
});
