const mongoose = require("mongoose");

const Post = require("./post");
const PageModel = require("../models/page");
const { uploadImage } = require("../util/image");

PageModel.statics.findPage = async function ({ pageId }) {
    const page = await Page.findById(pageId);
    if (!page)
        throw new Error("Page not Found");
    return page;
}

PageModel.statics.findAllPages = async function () {
    return await Page.find({});
}

PageModel.statics.findOwner = async function ({ id }) {
    const page = await Page.findById(id);
    if (!page)
        throw new Error("Page not Found");

    await page.populate('owner').execPopulate();
    return page.owner;
}

PageModel.statics.followPage = async function (pageId, userId) {
    if (!userId)
        throw new Error("User not authorized");

    const page = await Page.findById(pageId);
    if (!page)
        throw new Error("Page not Found");

    await page.addOrRemoveFollower({ userId });
    return page;
}

PageModel.statics.createPage = async function (args) {
    const { userId, coverSrc, profileSrc } = args;
    if (!userId)
        throw new Error("User not authorized");

    const page = new Page({
        ...args,
        owner: userId
    });

    if (coverSrc)
        page.coverUrl = await uploadImage(coverSrc);

    if (profileSrc)
        page.profileUrl = await uploadImage(profileSrc);

    return await page.save();
}

PageModel.statics.changePageCover = async function (args) {
    let { coverSrc, userId, pageId } = args;
    if (!userId)
        throw new Error("User not authoried");

    const page = await Page.findById(pageId);
    if (!page)
        throw new Error("Page not found");

    if (page.owner != userId)
        throw new Error("User not authoried");

    page.coverUrl = await uploadImage(coverSrc);
    return await page.save();
}

PageModel.statics.changePageProfile = async function (args) {
    let { profileSrc, userId, pageId } = args;
    if (!userId)
        throw new Error("User not authoried");

    const page = await Page.findById(pageId);
    if (!page)
        throw new Error("Page not found");

    if (page.owner != userId)
        throw new Error("User not authoried");

    page.profileUrl = await uploadImage(profileSrc);
    return await page.save();
}

PageModel.statics.deletePage = async function ({ pageId, userId }) {
    const page = await Page.findById(pageId);
    if (!page)
        throw new Error("Page not found");

    if (!userId || userId != page.owner)
        throw new Error("User not authorized");

    // TODO
    // delete posts

    await page.delete();
    return "Page deleted successfully!";
}


PageModel.statics.createPagePost = async function (args) {
    const { pageId, body, userId } = args;
    if (!userId)
        throw new Error("User not authorized")

    const page = await Page.findById(pageId);
    if (!page)
        throw new Error("Page not found");

    if (group.owner != userId)
        throw new Error("User not authorized")

    const post = await Post.createPost(args);
    page.posts.push(post._id);
    await page.save();
    return await page.save();
}

PageModel.statics.deletePagePost = async function (args) {
    const { pageId, postId, userId } = args;
    const page = await Page.findById(pageId);
    if (!page)
        throw new Error("Page not found");

    const pIdx = page.posts.findIndex(post => post._id == postId);

    if (pIdx == -1 || page.posts[pIdx].user != userId)
        throw new Error("User not authorized");

    page.posts.splice(pIdx, 1);
    await page.save();
    return await Post.deletePost(args);
}

PageModel.methods.addOrRemoveFollower = async function (userId) {
    if (this.followers.includes(userId))
        this.followers = this.followers.filter(follower => follower != userId);
    else
        this.followers.push(userId);
    await this.save();
}

const Page = mongoose.model("Page", PageModel);
module.exports = Page;
