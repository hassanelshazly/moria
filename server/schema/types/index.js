const { gql } = require("apollo-server");

const { Post } = require("./post");
const { User } = require("./user");
const { Message } = require("./message");
const { Notification } = require("./notification");
const { GroupChat } = require("./chat");

const typeDefs = gql`
    type Query {
        _empty: String
    }
    type Mutation {
        _empty: String
    }
    type Subscription {
        _empty: String
    }

    ${Post}
    ${User}
    ${Message}
    ${GroupChat}
    ${Notification}
`;

module.exports = typeDefs;