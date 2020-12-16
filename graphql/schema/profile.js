const { gql } = require('apollo-server-express');

module.exports = gql`

  enum ProfileRole {
    ADMIN USER SYSTEM SUPER_ADMIN
  }

  enum ProfileStatus {
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
    item: Post
    profile: Profile!
    description: String!
    createdAt: Date
    updatedAt: Date
  }

  extend type Query {
    getAllReportedProfiles(limit: Int!, skip: Int!): [ReportedProfile]
  }

  extend type Mutation {
    reportProfile(userId: String!, description: String!, reportedProfile: String!):Boolean!
    moderateUser(userId: String!, status: ProfileStatus!, moderatedBy: String!):Boolean!
    createProfile(username:String!, displayName:String!, email:String!, role: ProfileRole):Boolean!
  }
`;
