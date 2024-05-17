const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
const User = require('./user');

const PROTO_PATH = __dirname + '/user.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

mongoose.connect('mongodb://localhost:27017/restaurant', { useNewUrlParser: true, useUnifiedTopology: true });

const server = new grpc.Server();

server.addService(userProto.UserService.service, {
 /* CreateUser: async (call, callback) => {
    const user = new User(call.request);
    await user.save();
    callback(null, user);
  },*/
CreateUser : async (call, callback) => {
    const { name, email, role } = call.request;
    try {
      const user = new User({ name, email, role });
      const savedUser = await user.save();
      const response = {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
      };
      callback(null, response);
    } catch (error) {
      console.error('Error creating user:', error);
      callback({
        code: grpc.status.INTERNAL,
        message: error.message,
      });
    }
  },
  
  GetUser: async (call, callback) => {
    const user = await User.findById(call.request.id);
    callback(null, user);
  },
  UpdateUser: async (call, callback) => {
    const user = await User.findByIdAndUpdate(call.request.id, call.request, { new: true });
    callback(null, user);
  },
  DeleteUser: async (call, callback) => {
    await User.findByIdAndDelete(call.request.id);
    callback(null, {});
  }
});

server.bindAsync('localhost:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('User service running at http://localhost:50051');
  server.start();
});
