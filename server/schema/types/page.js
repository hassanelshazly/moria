const { gql } = require('apollo-server');

const Page = gql`

    type Page {
        id:         ID!
        owner:      User!
        title:      String!
        desc:       String
        createdAt:  String
        followers:  [User]
        Posts:      [Post]
    }

    extend type Query {
        findPage(pageId: ID!):     Page
    }

    extend type Mutation {
        likePage(postId: ID!):         Page
        createPage(title: String!):    Page!
        createPagePost(body: String!): Post!
        deletePagePost(postId: ID!):   String
    }


`;

module.exports = { Page }
