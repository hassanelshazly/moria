const User = require("./user");
const Page = require("./page");
const Group = require("./group");

async function searchUsers(pattern) {
    const users = await User.find({
        fullname: {
            $regex: pattern,
            $options: 'i'
        }
    }).limit(3);

    return users.map(user => {
        return {
            id: user._id,
            type: "USER",
            content: user,
        }
    });
}

async function searchPages(pattern) {
    const pages = await Page.find({
        title: {
            $regex: pattern,
            $options: 'i'
        }
    }).limit(3);

    return pages.map(page => {
        return {
            id: page._id,
            type: "PAGE",
            content: page,
        }
    });
}

async function searchGroups(pattern) {
    const groups = await Group.find({
        title: {
            $regex: pattern,
            $options: 'i'
        }
    }).limit(3);

    return groups.map(group => {
        return {
            id: group._id,
            type: "GROUP",
            content: group,
        }
    });
}

async function searchByKeyword({ keyword }) {
    const pattern = '.*' + keyword + '.*';

    const users = await searchUsers(pattern);
    const pages = await searchPages(pattern);
    const groups = await searchGroups(pattern);

    return users.concat(pages).concat(groups);
}

module.exports = {
    searchByKeyword
}