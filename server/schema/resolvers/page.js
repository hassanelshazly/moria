const Page = require("../../data/page");
const Post = require("../../data/post");
const { getAuthUser } = require("../../util/auth");

module.exports = {

    Query: {
        findPage(_, args) {
            return Page.findPage(args);
        },

        findAllPages(_, args) {
            return Page.findAllPages(args);
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
            return Page.createPagePost({
                ...args,
                ...getAuthUser(context)
            });
        },

        deletePagePost(_, args, context) {
            return Page.deletePagePost({
                ...args,
                ...getAuthUser(context)
            });
        },

        changePageCover(_, args, context) {
            return Page.changePageCover({
                ...args,
                ...getAuthUser(context)
            });
        },

        changePageProfile(_, args, context) {
            return Page.changePageProfile({
                ...args,
                ...getAuthUser(context)
            });
        }
    },


    Page: {
        owner(parent) {
            return Page.findOwner({ id: parent.id })
        },

        posts(parent) {
            return Page.findPosts({ id: parent.id });
        },

        followers(parent) {
            return Page.findFollowers({ id: parent.id });
        },

        followersCount(parent) {
            return parent.followers.length;
        }

    }
}