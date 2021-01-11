const { gql } = require('apollo-server');

const Group = gql`

    type Group {
        id:         ID!
        admin:      User!
        title:      String!
        coverUrl:   String
        profileUrl: String
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
        ): User

        changeGroupProfile(
            groupId:    ID!
            profileSrc: String!
        ): User
    }
`;

module.exports = { Group }
