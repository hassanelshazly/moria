const mongoose = require("mongoose");
const { post } = require("../models/page");

const PageModel = require("../models/page");

PageModel.statics.findPage = async function ({ pageId }) {
    const page = await Page.findById(pageId);
    await page.populate('owner').execPopulate();
    return page;
}

PageModel.statics.followPage = async function (pageId, userId) {
    if (!userId)
        throw new Error("User not authorized");

    const page = await Page.findById(pageId);
    if (!page)
        throw new Error("Page not Found");

    await page.addOrRemoveFollower({ userId });
    await page.populate('owner').execPopulate();
    return page;
    
}

PageModel.statics.createPage = async function (args) {
    const { userId } = args;
    if (!userId)
        throw new Error("User not authorized")

    const page = new Page({
        ...args,
        user: userId
    });
    await page.save();
    await page.populate('owner').execPopulate();
    return page
}

PageModel.statics.deletePage = async function ({ pageId, userId }) {
    const page = await Page.findById(pageId);
    if (!page)
        throw new Error("Page not found");
    
    if (!userId || userId != page.userId)
    throw new Error("User not authorized");

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

    page.posts.push({ userId, body });
    await page.save();
    await page.populate('owner').execPopulate();
    return page;
}

PageModel.statics.deletePagePost = async function (args) {
    const { pageId, postId, userId } = args;
    const page = await Page.findById(pageId);
    if (!page)
        throw new Error("Page not found");

    const pIdx = page.posts.findIndex(post => post._id == postId);

    if (pIdx == -1 || page.posts[pIdx].userId != userId)
        throw new Error("User not authorized");

    page.posts.splice(pIdx, 1);
    await page.save();
    await page.populate('owner').execPopulate;
    return page
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
