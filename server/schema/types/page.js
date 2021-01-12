const { gql } = require('apollo-server');

const Page = gql`

    type Page {
        id:             ID!
        owner:          User!
        title:          String!
        coverUrl:       String
        profileUrl:     String
        description:    String
        createdAt:      String
        followers:      [User]
        followersCount: Int!
        posts:          [Post]
    }

    extend type Query {
        findPage(
            pageId: ID!
        ): Page

        findAllPages: [Page]
    }

    extend type Mutation {
        followPage(
            pageId: ID!
        ): Page

        createPage(
            title: String!,
            coverSrc:  String,
            prfileSrc: String
        ): Page!

        deletePage(
            pageId: ID!
        ): String
        
        createPagePost(
            pageId:   ID!, 
            body:     String!
            imageSrc: String
        ): Post!
        
        deletePagePost(
            postId: ID!
            pageId: ID!
        ): String

        changePageCover(
            pageId:   ID!
            coverSrc: String!
        ): Page

        changePageProfile(
            pageId:     ID!
            profileSrc: String!
        ): Page
    }
`;

module.exports = { Page }
