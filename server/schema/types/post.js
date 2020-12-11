const { gql } = require('apollo-server');

const Post = gql`
  
    type Post {
        id: ID!
        body: String!
        username: String!
        createdAt: String!
        likes: [Like]
        comments: [Comment]
        likeCount: Int!
        commentCount: Int!
    }

    type Comment {
        id: ID!
        username: String!
        createdAt: String!
        body: String!
    }

    type Like {
        id: ID!
        username: String!
        createdAt: String!
    }

`;

module.exports = { Post };
