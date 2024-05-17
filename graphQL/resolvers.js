const User = require('../user/user');
const Reservation = require('../reservation/reservation');
const Food = require('../food/food');
const sendMessage = require('../kafka/kafkaProducer');

// Define resolvers for GraphQL queries and mutations
const resolvers = {
  Query: {
    // Resolver for fetching all users
    users: async () => await User.find(),
    // Resolver for fetching all reservations with user information populated
    reservations: async () => await Reservation.find().populate('user'),
    // Resolver for fetching all foods
    foods: async () => await Food.find(),
  },
  Mutation: {
    // Resolver for creating a new user
    createUser: async (_, { name }) => {
      const user = new User({ name });
      await user.save();// Save the new user to the database
      // Send a message to Kafka topic about the user creation event
      await sendMessage('restaurant-events', `User created: ${user.name}`);
      return user;// Return the created user
    },
    // Resolver for updating an existing user
    updateUser: async (_, { id, name }) => {
      const user = await User.findByIdAndUpdate(id, { name }, { new: true });
      if (!user) throw new Error('User not found');// Throw error if user is not found
      // Send a message to Kafka topic about the user update event
      await sendMessage('restaurant-events', `User updated: ${user.name}`);
      return user;// Return the updated user
    },
    // Resolver for deleting a user
    deleteUser: async (_, { id }) => {
      const user = await User.findByIdAndDelete(id);
      if (!user) throw new Error('User not found'); // Throw error if user is not found
      // Send a message to Kafka topic about the user deletion event
      await sendMessage('restaurant-events', `User deleted: ${user.name}`);
      return "User deleted";// Return a success message
    },
    // Resolver for creating a new reservation
    createReservation: async (_, { name }) => {
      const reservation = new Reservation({ name });
      await reservation.save();// Save the new food to the database
      // Send a message to Kafka topic about the food creation event
      await sendMessage('restaurant-events', `Reservation created: ${reservation.name}`);
      return reservation;// Return the created food
    },
    // Resolver for updating an existing reservation
    updateReservation: async (_, { id, name }) => {
      const reservation = await Reservation.findByIdAndUpdate(id, { name }, { new: true });
      if (!reservation) throw new Error('reservation not found');
      await sendMessage('restaurant-events', `Reservation updated: ${reservation.name}`);
      return reservation;
    },
    // Resolver for deleting a reservation
    deleteReservation: async (_, { id }) => {
      const reservation = await Reservation.findByIdAndDelete(id);
      if (!reservation) throw new Error('reservation not found');
    
      await sendMessage('restaurant-events', `Reservation deleted: ${reservation.name}`);
      return "Reservation deleted";// Return a success message
    },
    // Resolver for creating a new food
    createFood: async (_, { name }) => {
      const food = new Food({ name });
      await food.save();// Save the new food to the database
      // Send a message to Kafka topic about the food creation event
      await sendMessage('restaurant-events', `Food created: ${food.name}`);
      return food;// Return the created food
    },
    // Resolver for updating an existing food
    updateFood: async (_, { id, name }) => {
      const food = await Food.findByIdAndUpdate(id, { name }, { new: true });
      if (!food) throw new Error('Food not found');// Throw error if food is not found
      // Send a message to Kafka topic about the food update event
      await sendMessage('restaurant-events', `Food updated: ${food.name}`);
      return food;// Return the updated food
    },
    // Resolver for deleting a food
    deleteFood: async (_, { id }) => {
      const food = await Food.findByIdAndDelete(id);
      if (!food) throw new Error('Food not found');// Throw error if food is not found
      // Send a message to Kafka topic about the food deletion event
      await sendMessage('restaurant-events', `Food deleted: ${food.name}`);
      return "Food deleted";// Return a success message
    },
  },
};

// Export the resolvers module
module.exports = resolvers;
