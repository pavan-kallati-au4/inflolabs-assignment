const { gql } = require('apollo-server-express');

const profileSchema = require('./profile');
const postSchema = require('./post');

const linkSchema = gql`

  scalar Date

  type Query {
    _: Boolean
  }
 
  type Mutation {
    _: Boolean
  }
 
  type Subscription {
    _: Boolean
  }
`;

module.exports = [linkSchema, profileSchema, postSchema];