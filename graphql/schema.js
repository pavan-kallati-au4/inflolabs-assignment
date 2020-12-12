const { gql } = require('apollo-server-express');

module.exports = gql`

    scalar Date

    enum PostStatus {
        VALID MODERATED
    }

    enum ProfileStatus{
        VALID BLOCKED
    }

    enum ProfileRole {
        ADMIN USER SYSTEM
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
    
    type ReportedPost {
        item: Post!
        profile: Profile!
        description: String!
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
    
    type Query {
      
        getAllReportedPosts(limit: Int!, skip: Int!): [ReportedPost]
        getAllReportedProfiles(limit: Int!, skip: Int!): [ReportedProfile]
        
    }

    type Mutation {

        reportProfile(userId: String!, description: String!, reportedProfile: String!): Boolean!
      
        reportPost(userId: String!, description: String!, reportedPost: String!): Boolean!
       
        moderateUser(userId: String!, status: ProfileStatus!, moderatedBy: String!): Boolean!
        
        moderatePost(postId: String!, moderatedBy: String!, status: PostStatus!): Boolean!
   
    }

    schema {
        mutation: Mutation
        query: Query
    }
`;

