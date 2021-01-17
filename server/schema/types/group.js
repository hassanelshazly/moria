const { gql } = require('apollo-server-express');

const Group = gql`

    type Group {
        id:           ID!
        admin:        User!
        title:        String!
        coverUrl:     String
        profileUrl:   String
        membersCount: Int!
        createdAt:    String
        members:      [User]
        posts:        [Post]
        requests:     [User]
    }

    extend type Query {
        findGroup(groupId: ID!): Group
        findAllGroups:          [Group]
    }

    extend type Mutation {
        createGroup(
            title:     String!, 
            membersId: [ID!]!,
            coverSrc:  String
            prfileSrc: String
        ): Group!

        deleteGroup(
            groupId: ID!,
        ): String

        createGroupPost(
            groupId: ID!, 
            body: String!, 
            imageSrc: String
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

        changeGroupCover(
            groupId:  ID!
            coverSrc: String!
        ): Group

        changeGroupProfile(
            groupId:    ID!
            profileSrc: String!
        ): Group
    }
`;

module.exports = { Group }
