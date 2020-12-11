const { gql } = require('apollo-server');

const Mutation = gql`
  
    type Mutation {
        
        # User Mutations
        register(
            fullname: String!
            username: String!
            email: String!
            password: String!
        ): User   
        login(username: String!, password: String!): User

        # Post Mutations
        likePost(postId: ID!): Post
        createPost(body: String!): Post!
        deletePost(postId: ID!): String

        createComment(postId: ID!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post

    }
`;

module.exports = { Mutation };
