const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const Reservation = require('./reservation'); // Adjust the path if necessary

// Define the path to the reservation.proto file
const PROTO_PATH = __dirname + '/reservation.proto';

// Load the protobuf file and create a package definition
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,   // Keep field casing as defined in the .proto file
  longs: String,    // Convert long values to strings
  enums: String,    // Convert enum values to strings
  defaults: true,   // Use default values for fields if not set
  oneofs: true,     // Use the oneof feature
});

// Load the package definition into the gRPC object
const reservationProto = grpc.loadPackageDefinition(packageDefinition).reservation;

// Create a new gRPC server instance
const server = new grpc.Server();

// Add the ReservationService to the server and define its methods
server.addService(reservationProto.ReservationService.service, {
  GetReservation: async (call, callback) => {
    try {
      const reservation = await Reservation.findById(call.request.id);
      if (!reservation) {
        return callback(new Error('Reservation not found'));
      }
      callback(null, { id: reservation.id, name: reservation.name });
    } catch (err) {
      callback(err);
    }
  },

  // Define the CreateReservation RPC method
  CreateReservation: async (call, callback) => {
    try {
      const reservation = new Reservation({ name: call.request.name });
      await reservation.save();
      callback(null, { id: reservation.id, name: reservation.name });
    } catch (err) {
      callback(err);
    }
  },

  // Define the UpdateReservation RPC method
  UpdateReservation: async (call, callback) => {
    try {
      const reservation = await Reservation.findByIdAndUpdate(
        call.request.id,
        { name: call.request.name },
        { new: true }
      );
      if (!reservation) {
        return callback(new Error('Reservation not found'));
      }
      callback(null, { id: reservation.id});
    } catch (err) {
      callback(err);
    }
  },

  // Define the DeleteReservation RPC method
  DeleteReservation: async (call, callback) => {
    try {
      const reservation = await Reservation.findByIdAndDelete(call.request.id);
      if (!reservation) {
        return callback(new Error('Reservation not found'));
      }
      callback(null, { id: reservation.id, name: reservation.name });
    } catch (err) {
      callback(err);
    }
  },
});

// Bind the server to a specific address and port
server.bindAsync('localhost:50052', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Reservation gRPC service running at localhost:50052');
  // Start the gRPC server
  server.start();
});
