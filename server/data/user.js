const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const UserModel = require("../models/user");
const Post = require("./post");
const Notification = require("./notification");
const { FOLLOW } = require("../util/constant");
const { sendVerifyMail } = require("../util/mail");
const { authFacebook, authGoogle } = require("../util/auth");

UserModel.statics.findUser = function ({ username }) {
    return User.findOne({ username });
}

UserModel.statics.findPosts = async function ({ userId }) {
    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");

    await user.populate({
        path: 'posts',
        populate: {
            path: 'user'
        }
    }).execPopulate();
    return user.posts;
}

UserModel.statics.findTimeline = async function ({ userId }) {
    const user = await User.findById(userId);
    let posts = [];
    user.following.forEach(following => {
        posts = posts.concat(User.findPosts({ userId: following._id }));
    });
    return posts;
}

UserModel.statics.follow = async function ({ userId, id }) {
    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");

    const toFollow = await User.findById(id);
    if (!toFollow)
        throw new Error("User not found");

    const created = await user.addOrRemoveFollowing(id);
    await toFollow.addOrRemoveFollower(userId);

    if (created) {
        await Notification.createNotification({
            content: FOLLOW,
            contentId: id,
            author: userId
        });
    } else {
        await Notification.deleteMany({
            content: FOLLOW,
            contentId: id,
            author: userId
        });
    }

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

UserModel.statics.findFollowers = async function ({ userId }) {
    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");
    await user.populate('followers').execPopulate();
    return user.followers;
}

UserModel.statics.findFollowing = async function ({ userId }) {
    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");
    await user.populate('following').execPopulate();
    return user.following;
}

UserModel.statics.findSavedPosts = async function ({ userId }) {
    const user = await User.findById(userId);
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

UserModel.statics.isActivated = async function ({ userId }) {
    const user = await User.findById(userId);
    if (!user)
        throw new Error("User not found");
    return user.isActivated;
}

UserModel.statics.verifyAccount = async function ({ activationToken }) {
    const user = await User.findOne({ activationToken });
    if (!user)
        throw new Error("Activation failed");

    user.isActivated = true;
    await user.save();
    return user;
}

UserModel.statics.register = async function (user) {
    let { username, fullname, email, password } = user;
    // validate the data
    if (!validator.isEmail(email))
        throw new Error("E-Mail is invalid.");

    if (!validator.isLength(password, { min: 5 }))
        throw new Error("Password too short!");

    const existingUsername = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    if (existingUsername | existingEmail)
        throw new Error('User exists already!');

    // hash the password
    user.password = await bcrypt.hash(password,
        parseInt(process.env.SALT_LENGTH));

    // Store into the database
    const newUser = new User(user);
    await newUser.save();

    activationToken = newUser.generateAuthToken();
    newUser.activationToken = activationToken;
    await newUser.save();

    // send verifaction mail 
    sendVerifyMail(email, fullname, activationToken);

    // genertate jwt token for the session
    newUser.generateAuthToken();

    // return the user
    return newUser;
}

UserModel.statics.facebookLogin = async function ({ accessToken }) {
    const { data, info } = await authFacebook({
        body: {
            access_token: accessToken
        }
    }, {});

    if (info)
        throw new Error("Error occured in login using fb");

    const { profile } = data;
    let user = await User.findOne({ 'social.facebookId': profile.id });
    if (!user) {
        user = new User({
            isActivated: true,
            username: new ObjectId,
            fullname: profile.displayName,
            email: profile.emails[0].value || new ObjectId,
            'social.facebookId': profile.id
        });
    }

    await user.save();
    user.generateAuthToken();
    return user;
}

UserModel.statics.googleLogin = async function ({ accessToken }) {
    const { data, info } = await authGoogle({
        body: {
            access_token: accessToken,
            refresh_token: "null"
        }
    }, {});

    if (info)
        throw new Error("Error occured in login using Google");

    const { profile } = data;
    let user = await User.findOne({ 'social.googleId': profile.id });
    if (!user) {
        user = new User({
            isActivated: true,
            username: new ObjectId,
            fullname: profile.displayName,
            email: profile.emails[0].value || "null",
            'social.googleId': profile.id
        });
    }

    await user.save();
    user.generateAuthToken();
    return user;
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
    let created = false;
    if (this.following.includes(userId)) {
        this.following = this.following.filter(following => following != userId);
        created = false;
    }
    else {
        this.following.push(userId);
        created = true;
    }
    await this.save();
    return created;
}

UserModel.methods.saveOrUnSavePost = async function (postId) {
    let created = false;
    if (this.savedPosts.includes(postId)) {
        this.savedPosts = this.savedPosts.filter(post => post != postId);
        created = false;
    }
    else {
        this.savedPosts.push(postId);
        created = true;
    }
    await this.save();
    return created;
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
