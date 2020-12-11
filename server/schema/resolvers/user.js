const User = require("../../data/user");
const Post = require("../../data/post");

module.exports = {

    Query: {
        findUser(_, args) {
            return User.findUser(args);
        }
    },

    Mutation: {
        register(_, args) {
            return User.register(args);
        },

        login(_, args) {
            return User.login(args);
        }
    },

    User: {
        posts(parent, args) {
            return Post.findPosts(parent);
        },

        followers(parent, args) {
            // TODO
            return null;
        },

        following(parent, args) {
            // TODO
            return
        }
    }
}