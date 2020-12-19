const { gql } = require('apollo-server');

const Post = gql`
  
    type Post {
        id:           ID!
        user:         User!
        body:         String!
        createdAt:    String!
        likes:        [ID]
        comments:     [Comment]
        likeCount:    Int!
        commentCount: Int!
    }

    type Comment {
        id:        ID!
        body:      String!
        user:      User!
        createdAt: String!
    }

    extend type Query {
        findPost(postId: ID!):        Post
        findPosts(username: String!): [Post]
    }

    extend type Mutation {
        likePost(postId: ID!):     Post
        createPost(body: String!): Post!
        deletePost(postId: ID!):   String

        createComment(postId: ID!, body: String!):  Post!
        deleteComment(postId: ID!, commentId: ID!): Post
    }
`;

module.exports = { Post };
