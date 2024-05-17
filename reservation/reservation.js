const mongoose = require('mongoose');

// Extract the Schema constructor from mongoose
const Schema = mongoose.Schema;

// Define the Reservation schema with 'customerName' and 'reservationDate' fields
const reservationSchema = new Schema({
  name: { type: String, required: true }
  
});

// Create a model named 'Reservation' using the reservationSchema
const Reservation = mongoose.model('Reservation', reservationSchema);

// Export the Reservation model to be used in other parts of the application
module.exports = Reservation;
