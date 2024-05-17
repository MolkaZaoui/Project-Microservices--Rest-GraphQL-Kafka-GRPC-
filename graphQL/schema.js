const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Food {
    id: ID!
    name: String!
  }

  type Reservation {
    id: ID!
    title: String!
    food: Food!
  }

  type User {
    id: ID!
    name: String!
  }

  type Query {
    foods: [Food]
    reservations: [Reservation]
    users: [User]
  }

  type Mutation {
    createFood(name: String!): Food
    updateFood(id: ID!, name: String!): Food
    deleteFood(id: ID!): String
    createReservation(name: String!): Reservation
    updateReservation(id: ID!, name: String!): Reservation
    deleteReservation(id: ID!): String
    createUser(name: String!): User
    updateUser(id: ID!, name: String!): User
    deleteUser(id: ID!): String
  }
`;

module.exports = typeDefs;
