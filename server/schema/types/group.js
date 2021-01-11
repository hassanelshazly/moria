const { gql } = require('apollo-server');

const Group = gql`

    type Group {
        id:         ID!
        admin:      User!
        title:      String!
        createdAt:  String
        members:    [User]
        posts:      [Post]
        requests:   [User]
    }

    extend type Query {
        findGroup(groupId: ID!): Group
        findAllGroups:          [Group]
    }

    extend type Mutation {
        createGroup(
            title: String!, 
            membersId: [ID!]!
        ): Group!

        deleteGroup(
            groupId: ID!
        ): String

        createGroupPost(
            groupId: ID!, 
            body: String!, 
            imageUrl: String
        ): Post!

        deleteGroupPost(
            groupId: ID!, 
            postId: ID!
        ): String

        sendRequest(
            groupId: ID!
        ): Group!

        acceptRequest(
            groupId: ID!,
            memberId: ID!
        ): Group!

        addMembers(
            groupId: ID!
            membersId: [ID!]!
        ): Group!
    }
`;

module.exports = { Group }
