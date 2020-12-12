const { gql } = require('apollo-server-express');

module.exports = gql`
  type Report {
    userId: String!
    reportedProfile: ID
    reportedPost: ID
    description: String!
  }

  type Mutation {

    reportProfile(userId: String!, description: String!, reportedProfile: String!): Boolean!
  
    reportPost(userId: String!, description: String!, reportedPost: String!): Boolean!
  }
`;