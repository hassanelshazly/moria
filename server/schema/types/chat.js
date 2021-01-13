const { gql } = require('apollo-server');

const GroupChat = gql`

    type GroupChat {
        id:        ID!
        title:     String!
        admin:     User!
        members:   [User]
        messages:  [Message]
        createdAt:  String!
    }

    extend type Query {
        findGroupChats: [GroupChat]
    }

    extend type Mutation {
        createGroupChat(
            title: String!, 
            membersId: [ID!]!
        ): GroupChat
        
        sendGroupMessage(
            groupChatId: ID!,
            body: String!
        ): Message
    }
`;

module.exports = { GroupChat }
