const { gql } = require('apollo-server-express');

module.exports = gql`

    type ReportedPost {
        body:String!
    }

    type ReportedProfile {
        username:String!

    }

    type Query {
      
        getAllReportedPosts(limit: Int!, skip: Int!): [ReportedPost]
        getAllReportedProfiles(limit: Int!, skip: Int!): [ReportedProfile]
        
    }

    
    

    

`;

