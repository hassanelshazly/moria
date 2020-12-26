const { gql } = require('apollo-server');

const Query = gql`

    type Query {
        findPost(postId: ID!): Post
        findPosts(username: String!): [Post]
        findUser(username: String!) : User
        findPage(pageId: ID!): Page
        findGroup(groupId: ID!): Group
    }

`;

module.exports = { Query };
