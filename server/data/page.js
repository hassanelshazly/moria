const mongoose = require("mongoose");

const PageModel = require("../models/page");

PageModel.statics.findPage = async function (args) {

}

PageModel.statics.followPage = async function (args) {

}

PageModel.statics.createPage = async function (args) {

}

PageModel.statics.createPagePost = async function (args) {

}

PageModel.statics.deletePagePost = async function (args) {

}



const Page = mongoose.model("Page", PageModel);
module.exports = Page;
