const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const mongoose = require("mongoose");

const UserModel = require("../models/user");
const Post = require("./post");
const Notification = require("./notification");
const { FOLLOW } = require("../util/constant");


UserModel.statics.findUser = function ({ username }) {
    return User.findOne({ username });
}

UserModel.statics.follow = async function ({ userId, id }) {
    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");

    const toFollow = await User.findById(id);
    if (!toFollow)
        throw new Error("User not found");

    await user.addOrRemoveFollowing(id);
    await toFollow.addOrRemoveFollower(userId);

    await Notification.createNotification({
        content: FOLLOW,
        contentId: id,
        author: userId
    });

    return user;
}

UserModel.statics.savePost = async function ({ userId, postId }) {
    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");

    const post = await Post.findById(postId);
    if (!post)
        throw new Error("Post not found");

    await user.saveOrUnSavePost(postId);
    return user;
}

UserModel.statics.findFollowers = async function ({ id }) {
    const user = await User.findById(id);
    if (!user)
        throw new Error("User not found");
    await user.populate('followers').execPopulate();
    return user.followers;
}

UserModel.statics.findFollowing = async function ({ id }) {
    const user = await User.findById(id);
    if (!user)
        throw new Error("User not found");
    await user.populate('following').execPopulate();
    return user.following;
}

UserModel.statics.findSavedPosts = async function ({ id }) {
    const user = await User.findById(id);
    if (!user)
        throw new Error("User not found");
    await user.populate('savedPosts').execPopulate();
    return user.savedPosts;
}

UserModel.statics.login = async function ({ username, password }) {
    // get user from database
    const user = await User.findOne({ username });

    // in case of the user is not in the database
    if (!user)
        throw new Error("User not found");

    // match the passward
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        throw new Error("Password does not match");

    // genertate jwt token for the session
    user.generateAuthToken();

    // return the user
    return user;
}

UserModel.statics.register = async function (user) {
    let { username, email, password } = user;
    // validate the data
    if (!validator.isEmail(email))
        throw new Error("E-Mail is invalid.");

    if (!validator.isLength(password, { min: 5 }))
        throw new Error("Password too short!");

    const existingUser = await User.findOne({ username });
    if (existingUser)
        throw new Error('User exists already!');

    // hash the password
    user.password = await bcrypt.hash(password,
        parseInt(process.env.SALT_LENGTH));

    // Store into the database
    const newUser = new User(user);
    await newUser.save();

    // genertate jwt token for the session
    newUser.generateAuthToken();

    // return the user
    return newUser;
}

UserModel.methods.generateAuthToken = function () {
    this.token = jwt.sign({
        username: this.username,
        userId: this._id
    },
        process.env.JWT_SECRET,
        { expiresIn: "1 week" });
    return this.token;
}

UserModel.methods.addOrRemoveFollower = async function (userId) {
    if (this.followers.includes(userId))
        this.followers = this.followers.filter(follower => follower != userId);
    else
        this.followers.push(userId);
    await this.save();
}

UserModel.methods.addOrRemoveFollowing = async function (userId) {
    if (this.following.includes(userId))
        this.following = this.following.filter(following => following != userId);
    else
        this.following.push(userId);
    await this.save();
}

UserModel.methods.saveOrUnSavePost = async function (postId) {
    if (this.savedPosts.includes(postId))
        this.savedPosts = this.savedPosts.filter(post => post != postId);
    else
        this.savedPosts.push(postId);
    await this.save();
}

// It's placed here to avoid circular dependency
UserModel.statics.findNotifications = async function ({ userId }) {
    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");
    await user.populate({
        path: 'notifications',
        populate: [
            {
                path: 'user'
            }, 
            {
                path: 'author'
            }
        ]
    }).execPopulate();
    return user.notifications;
}

const User = mongoose.model("User", UserModel);
module.exports = User;
