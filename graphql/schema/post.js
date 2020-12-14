const { gql } = require('apollo-server-express');

module.exports = gql`

  enum PostStatus {
    VALID MODERATED
  }

  type Post {
		id: ID!
		body: String!
    isPrivate: Boolean!
		status: PostStatus!
		profile: Profile!
		createdAt: Date
		updatedAt: Date
		deletedAt: Date
  }

  type ReportedPost {
    item: Post!
    profile: Profile
    description: String!
    createdAt: Date
    updatedAt: Date
  }

  extend type Query {
    getAllReportedPosts(limit: Int!, skip: Int!): [ReportedPost]
  }

  extend type Mutation {
    reportPost(userId: String!, description: String!, reportedPost: String!): Boolean!
    moderatePost(postId: String!, moderatedBy: String!, status: PostStatus!): Boolean!
    createPost(userId:String!, body:String!, isPrivate:Boolean): Boolean!
  }
`;