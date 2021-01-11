const { gql } = require('apollo-server');

const Page = gql`

    type Page {
        id:         ID!
        owner:      User!
        title:      String!
        desc:       String
        createdAt:  String
        followers:  [User]
        posts:      [Post]
    }

    extend type Query {
        findPage(pageId: ID!):     Page
    }

    extend type Mutation {
        followPage(postId: ID!):        Page
        createPage(title: String!):     Page!
        deletePage(title: String!):      String
        createPagePost(body: String!):  Post!
        deletePagePost(postId: ID!):    String
    }
`;

module.exports = { Page }
