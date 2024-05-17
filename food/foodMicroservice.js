const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const Food = require('./food');

// Define the path to the food.proto file
const PROTO_PATH = __dirname + '/food.proto'; // Ensure the file path is correct

// Load the protobuf file and create a package definition
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,   // Keep field casing as defined in the .proto file
  longs: String,    // Convert long values to strings
  enums: String,    // Convert enum values to strings
  defaults: true,   // Use default values for fields if not set
  oneofs: true,     // Use the oneof feature
});

// Load the package definition into the gRPC object
const foodProto = grpc.loadPackageDefinition(packageDefinition).food;

// Create a new gRPC server instance
const server = new grpc.Server();

// Add the FoodService to the server and define its methods
server.addService(foodProto.FoodService.service, {
  GetFood: async (call, callback) => {
    try {
      const food = await Food.findById(call.request.id);
      if (!food) {
        return callback(new Error('Food not found'));
      }
      callback(null, { id: food.id, name: food.name });
    } catch (err) {
      callback(err);
    }
  },

  // Define the CreateFood RPC method
  CreateFood: async (call, callback) => {
    try {
      const food = new Food({ name: call.request.name });
      await food.save();
      callback(null, { id: food.id, name: food.name });
    } catch (err) {
      callback(err);
    }
  },

  // Define the UpdateFood RPC method
  UpdateFood: async (call, callback) => {
    try {
      const food = await Food.findByIdAndUpdate(call.request.id, { name: call.request.name }, { new: true });
      if (!food) {
        return callback(new Error('Food not found'));
      }
      callback(null, { id: food.id, name: food.name });
    } catch (err) {
      callback(err);
    }
  },

  // Define the DeleteFood RPC method
  DeleteFood: async (call, callback) => {
    try {
      const food = await Food.findByIdAndDelete(call.request.id);
      if (!food) {
        return callback(new Error('Food not found'));
      }
      callback(null, { id: food.id, name: food.name });
    } catch (err) {
      callback(err);
    }
  },
});

// Bind the server to a specific address and port
server.bindAsync('localhost:50053', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Food gRPC service running at localhost:50053');
  // Start the gRPC server
  server.start();
});
