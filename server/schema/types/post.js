const { gql } = require('apollo-server-express');

const Post = gql`
  
    type Post {
        id:           ID!
        user:         User!
        meta:         MetaPost!
        body:         String!
        imageUrl:     String
        createdAt:    String!
        likes:        [User]
        comments:     [Comment]
        isShared:     Boolean
        likeCount:    Int!
        commentCount: Int!
    }

    type Comment {
        id:        ID!
        body:      String!
        user:      User!
        createdAt: String!
    }

    type MetaPost {
        type:     String!
        parentId: ID!
    }

    extend type Query {
        findPost(postId: ID!):   Post
    }

    extend type Mutation {
        likePost(
            postId: ID!
        ): Post
        
        createPost(
            body: String!, 
            imageSrc: String
        ): Post!
        
        deletePost(
            postId: ID!
        ): String

        createComment(
            postId: ID!, 
            body: String!
        ):  Post!

        deleteComment(
            postId: ID!, 
            commentId: ID!
        ): Post
    }
`;

module.exports = { Post };
