const { gql } = require('apollo-server');

const Notification = gql`

    type Notification {
        id:        ID!
        user:      User!
        author:    User!
        contentId: ID!
        content:   String!
        createdAt: String!
    }

    extend type Query {
        findNotifications: [Notification]
    }

    extend type Subscription {
        newNotification: Notification
    }
`;

module.exports = { Notification }
