const Page = require("../../data/page");
const Post = require("../../data/post");
const { getAuthUser } = require("../../util/auth");

module.exports = {

    Query: {
        findPage(_, args) {
            return Page.findPage(args);
        }
    },


    Mutation: {
        followPage(_, args, context) {
            return Page.followPage({
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

        deletePage(_, args, context) {
            return Page.deletePage({
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
        posts(parent, args) {
            return Post.findPosts(parent);
        },

        followers(parent, args) {
            return parent.followers.length;
        }

    }
}