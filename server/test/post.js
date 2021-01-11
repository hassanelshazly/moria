const dotenv = require('dotenv').config();
const assert = require('assert');
const mongoose = require('mongoose');
const User = require("../data/user");
const Post = require("../data/post");
const { ObjectId } = mongoose.Types;

describe("Post", () => {
    before(async function () {
        this.timeout(5000);
        try {
            await mongoose.connect(process.env.MONGO_URI_TEMP, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            });
        } catch {
            console.error("Database connection error");
        }

        testName = "Test User";
        testUsername = "testuserusernamerandomone";
        testEmail = "testuserusernamerandomone@gmail.com";
        testPassword = "123456789";

        const user = await User.register({
            fullname: testName,
            username: testUsername,
            email: testEmail,
            password: testPassword,
        });
        testUserId = user._id;

        testPostBody = "thispostisfortesingpurposandwhateverthisthingues";
    });

    after(async () => {
        await User.deleteOne({ username: testUsername });
    });

    describe("#creatPost()", () => {
        beforeEach(async () => {
            await Post.deleteMany({ user : testUserId });
        });

        afterEach(async () => {
            await Post.deleteMany({ user : testUserId });
        });

        it("Normal Post Creation", async () => {
            const post = await Post.createPost({
                body: testPostBody,
                userId: testUserId
            });
            assert.ok(post);

            const dbPost= await Post.findById(post._id);
            assert.ok(dbPost);

            assert.strictEqual(post.body, dbPost.body);
        });

        it("Not Providing Id", async () => {
            try {
                const post = await Post.createPost({
                    body: testPostBody
                });
                assert.fail("Post Without userId has been accepted");
            } catch {
                const post = await Post.findOne({ body: testPostBody });
                if (post)
                    assert.fail("Wrong data has been stored in db");
            }
        });
    });

    describe("#createComment()", async () => {
        beforeEach(async () => {
            const post = await Post.createPost({
                body: testPostBody,
                userId: testUserId
            });

            testPostId = post._id;
        });

        afterEach(async () => {
            await Post.deleteMany({ user : testUserId });
        });


        it("Normal Comment Creation", async () => {
            const post = await Post.createComment({
                userId: testUserId,
                postId: testPostId,
                body: testPostBody
            });

            assert.ok(post);
            assert.strictEqual(post.comments.length, 1);
            assert.strictEqual(post.comments[0].body, testPostBody);
        });
    });

    describe("#likePost()", async () => {
        beforeEach(async () => {
            const post = await Post.createPost({
                body: testPostBody,
                userId: testUserId
            });

            testPostId = post._id;
        });

        afterEach(async () => {
            await Post.deleteMany({ user : testUserId });
        });


        it("like post once", async () => {
            const post = await Post.likePost({
                userId: testUserId,
                postId: testPostId
            });

            assert.ok(post);
            assert.strictEqual(post.likes.length, 1);
            assert.strictEqual(post.likes[0]._id, testUserId);
        });

        it("like post twice", async () => {
            let post = await Post.likePost({
                userId: testUserId,
                postId: testPostId
            });

            assert.ok(post);
            assert.strictEqual(post.likes.length, 1);
            assert.strictEqual(post.likes[0]._id, testUserId);

            post = await Post.likePost({
                userId: new ObjectId(testUserId),
                postId: new ObjectId(testPostId)
            });

            assert.ok(post);
            assert.strictEqual(post.likes.length, 1);
        });
    });
});