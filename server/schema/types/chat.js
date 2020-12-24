const { gql } = require('apollo-server');

const GroupChat = gql`

    type GroupChat {
        id:        ID!
        admin:     User!
        members:   [User]
        messages:  [Message]
        createdAt: String!
    }

    extend type Query {
        findGroupChats: [GroupChat]
    }

    extend type Mutation {
        createGroupChat(membersId: [ID!]!): GroupChat
        sendGroupMessage(groupChatId: ID!, body: String!): Message
    }
`;

module.exports = { GroupChat }
