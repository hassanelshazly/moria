const { gql } = require('apollo-server-express');

const Message = gql`

    union UserGroup =  User | GroupChat

    type Message {
        id:        ID!
        from:      User!
        to:        UserGroup!
        body:      String!
        createdAt: String!
    }

    # type Conversation {
    #     id:                   ID!
    #     lastMessage:          String
    #     lastMessageSender:    Boolean
    #     lastMessageCreatedAt: String
    # }

    extend type Query {
        findMessages(
            toUserId: ID!
        ): [Message]
        # findConversations:       [Conversation]
    }

    extend type Mutation {
        sendMessage(
            toUserId: ID!, 
            body: String!
        ): Message
    }

    extend type Subscription {
        newMessage: Message
    }
`;

module.exports = { Message }
