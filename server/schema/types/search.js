const { gql } = require('apollo-server');

const Search = gql`

    union SearchUnion =  User | Group | Page 

    type Search {
        id:      ID!
        type:    String!
        content: SearchUnion
    }

    extend type Query {
        search(
            keyword: String
        ): [Search]
    }
`;

module.exports = { Search }
