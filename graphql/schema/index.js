const { gql } = require('apollo-server-express');

const profileSchema = require('./profile');
const postSchema = require('./post');
const reportSchema = require('./report');

const linkSchema = gql`
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

module.exports = [linkSchema, profileSchema, postSchema, reportSchema];