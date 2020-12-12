const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar Date

  enum ProfileRole {
    ADMIN USER SYSTEM
  }

  enum ProfileStatus{
    VALID BLOCKED
  }

  type Profile {
    userId: ID!
    username: String!
    displayName: String!
    email: String!
    verifiedAt: Date!
    role: ProfileRole!
    status: ProfileStatus!
    createdAt: Date
    updatedAt: Date
  }

  type ReportedProfile {
    item: Profile!
    profile: Profile!
    description: String!
    createdAt: Date
    updatedAt: Date
  }

  extend type Query {
    getAllReportedProfiles(limit: Int!, skip: Int!): [ReportedProfile]
  }

  extend type mutation {
    moderateUser(userId: String!, status: ProfileStatus!, moderatedBy: String!): Boolean!
  }
`;