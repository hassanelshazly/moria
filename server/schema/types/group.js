const { gql } = require('apollo-server');

const Group = gql`

    type Group {
        id:           ID!
        admin:        User!
        title:        String!
        createdAt:    String
        Members:      [User]
        posts:        [Post]
    }


`;

module.exports = { Group }
