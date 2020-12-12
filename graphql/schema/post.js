const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar Date

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
    profile: Profile!
    description: String!
    createdAt: Date
    updatedAt: Date
  }

  type Query {
    getAllReportedPosts(limit: Int!, skip: Int!): [ReportedPost]
  }

  type mutation {
    moderatePost(postId: String!, moderatedBy: String!, status: PostStatus!): Boolean!
  }
`;