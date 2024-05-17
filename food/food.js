// Import the mongoose library
const mongoose = require('mongoose');

// Extract the Schema constructor from mongoose
const Schema = mongoose.Schema;

// Define the Food schema with a single field 'name' which is a required string
const foodSchema = new Schema({
  name: { type: String, required: true } // 'name' field must be a string and is required
});

// Create a model named 'Food' using the foodSchema
const Food = mongoose.model('Food', foodSchema);

// Export the Food model to be used in other parts of the application
module.exports = Food;
