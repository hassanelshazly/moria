const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const mongoose = require("mongoose");

const UserModel = require("../models/user");


UserModel.statics.findUser = function ({ username }) {
    return User.findOne({ username });
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

const User = mongoose.model("User", UserModel);
module.exports = User;
