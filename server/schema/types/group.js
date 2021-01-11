const { gql } = require('apollo-server');

const Group = gql`

    type Group {
        id:           ID!
        admin:        User!
        title:        String!
        createdAt:    String
        members:      [User]
        posts:        [Post]
    }

    extend type Query {
        findGroup(groupId: ID!):   Group
    }

    extend type Mutation {
        createGroup(title: String!):    Group!
        deleteGroup(title: String!):    String
        createGroupPost(body: String!): Post!
        deleteGroupPost(postId: ID!):   String
    }
`;

module.exports = { Group }
