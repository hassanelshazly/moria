const Page = require("../../data/page");
const Post = require("../../data/post");

module.exports = {

    Query: {
        findPage(_, args) {
            return Page.findPage(args);
        }
    },


    Mutation: {
        likePage(_, args, context) {
            return Page.likePage({
                ...args,
                ...getAuthUser(context)
            });
        },

        createPage(_, args, context) {
            return Page.createPage({
                ...args,
                ...getAuthUser(context)
            });
        },

        createPagePost(_, args, context) {
            return Page.createPost({
                ...args,
                ...getAuthUser(context)
            });
        },

        deletePagePost(_, args, context) {
            return Page.deletePost({
                ...args,
                ...getAuthUser(context)
            });
        }
    },


    Page: {
        likeCount(parent) {
            return parent.likes.length;
        },

        posts(parent, args) {
            return Post.findPosts(parent);
        },

        followers(parent, args) {
            return parent.followers.length;
        }

    }
}