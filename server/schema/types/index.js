const { gql } = require("apollo-server");

const { Post } = require("./post");
const { User } = require("./user");
const { Page } = require("./page");
const { Group } = require("./group");
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
    ${Page}
    ${Group} 
    ${Message}
    ${GroupChat}
    ${Notification}
`;

module.exports = typeDefs;