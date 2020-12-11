const { gql } = require('apollo-server');

const Post = gql`
  
    type Post {
        id: ID!
        body: String!
        userId: String!
        createdAt: String!
        likes: [ID]
        comments: [Comment]
        likeCount: Int!
        commentCount: Int!
    }

    type Comment {
        id: ID!
        body: String!
        userId: String!
        createdAt: String!
    }

    # type Like {
    #     id: ID!
    #     userId: String!
    #     createdAt: String!
    # }

`;

module.exports = { Post };
