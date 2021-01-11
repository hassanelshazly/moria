const { gql } = require('apollo-server');

const Page = gql`

    type Page {
        id:          ID!
        owner:       User!
        title:       String!
        description: String
        createdAt:   String
        followers:   [User]
        posts:       [Post]
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
            title: String!
        ): Page!

        deletePage(
            pageId: ID!
        ): String
        
        createPagePost(
            pageId: ID!, 
            body: String!
        ): Post!
        
        deletePagePost(
            postId: ID!
        ): String
    }
`;

module.exports = { Page }
