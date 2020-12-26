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

    extend type Query {
        findUser(username: String!) : User
    }

    extend type Mutation {
        register(
            fullname: String!
            username: String!
            email:    String!
            password: String!
        ): User  

        login(
            username: String!
            password: String!
        ): User

        loginUsingFacebook(
            accessToken: String!
        ): User

        loginUsingGoogle(
            accessToken: String!
        ): User

        follow(id: ID!):       User
        savePost(postId: ID!): User
    }
`;

module.exports = { User }
