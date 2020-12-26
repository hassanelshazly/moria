const { gql } = require('apollo-server');

const Page = gql`

    type Page {
        id:         ID!
        owner:      User!
        title:      String!
        Desc:       String
        createdAt:  String
        followers:  [User]
        Posts:      [Post]
    }


`;

module.exports = { Page }
