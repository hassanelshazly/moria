const { gql } = require('apollo-server');

const User = gql`

    type User {
        id:         ID!
        username:   String!
        email:      String!
        fullname:   String!
        createdAt:  String
        coverUrl:   String
        profileUrl: String
        birthDate:  String
        token:      String
        followers:  [User]
        following:  [User]
        posts:      [Post]
        savedPosts: [Post]
        pages:      [Page]
        groups:     [Group]
    }

    extend type Query {
        findUser(
            username: String!
        ): User

        findPosts(
            userId: String!
        ): [Post]

        findAllUsers: [User]
        findTimeline: [Post]
        isActivated:  Boolean
    }

    extend type Mutation {
        register(
            fullname:  String!
            username:  String!
            email:     String!
            password:  String!
            birthDate: String
            coverSrc:  String
            prfileSrc: String
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

        verifyAccount(
            activationToken: String!
        ): User

        follow(
            id: ID!
        ): User

        savePost(
            postId: ID!
        ): User

        changeCover(
            coverSrc: String!
        ): User

        changeProfile(
            profileSrc: String!
        ): User
    }
`;

module.exports = { User }
