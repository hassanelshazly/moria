const { gql } = require('apollo-server');

const User = gql`

    type User {
        id:         ID!
        username:   String!
        email:      String!
        fullname:   String!
        createdAt:  String
        token:      String
        followers:  [User]
        following:  [User]
        posts:      [Post]
        savedPosts: [Post]
    }


`;

module.exports = { User }
