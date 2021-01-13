const dotenv = require('dotenv').config()
const assert = require('assert')
const mongoose = require('mongoose')
const User = require("../data/user")
const Post = require("../data/user")
const Page = require("../data/page")
const { ObjectId } = mongoose.Types;

describe("Page", () => {
    before(async function () {
        try {
            await mongoose.connect(process.env.MONGO_URI_TEMP, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            })
        } catch {
            console.error("Database connection error");
        }
        testName = "Test User";
        testUsername = "testuserusernamerandomone";
        testEmail = "testuserusernamerandomone@gmail.com";
        testPassword = "123456789";
        let user;
        try {
            user = await User.register({
                fullname: testName,
                username: testUsername,
                email: testEmail,
                password: testPassword,
            });
        } catch (err) {
            await User.deleteOne({ username: testUsername })
            assert.fail(err);
        }
        testUserId = user._id;
        testcoverSrc = "sfsd.jpeg";
        testprofileSrc = "sdflsdv.jpeg";
        testTitle = "fskbs";// page must have a title
        testPostBody = "sfgkbskgvbl";


    })
    after(async () => {
        await User.deleteOne({ username: testUsername })
    })
    describe("#createPage()", () => {
        beforeEach(async () => {
            await Page.deleteMany({ admin: testUserId });
        });
        afterEach(async () => {
            await Page.deleteMany({ admin: testUserId });
        });

        it("Normal Page Creation", async () => {
            const page = await Page.createPage({
                userId: testUserId,
                title: testTitle,
                coverSrc: testcoverSrc,
                profileSrc: testprofileSrc
            })
            assert.ok(page)

            const dbPage = await Page.findById(page._id);
            assert.ok(dbPage)
           
            assert.strictEqual(page.title, page.title);
        })
        it("Not Providing Id", async () => {
            try {
                const page = await Page.createPage({
                    title: testTitle,
                    coverSrc: testcoverSrc,
                    profileSrc: testprofileSrc
                })
                assert.fail("Page Without userId has been accepted");
            } catch {
                const page = await Page.findOne({ title: testTitle });
                if (page)
                    assert.fail("Wrong data has been stored in db");
            }
        })


    })
    
    describe("#createPagePost()", async () => {
        beforeEach(async () => {
            const page = await Page.createPage({
                title: testTitle,
                userId: testUserId,
                coverSrc: testcoverSrc,
                profileSrc: testprofileSrc
            })

            testPageId = page._id;
        })

        afterEach(async () => {
            await Post.deleteMany({ user: testUserId });
            await Page.deleteMany({ admin: testUserId });
        })


        it("Normal Post Post Creation", async () => {
            const post = await Page.createPagePost({
                userId: testUserId,
                testPageId: testPageId,
                body: testPostBody
            })

            assert.ok(post);
            assert.strictEqual(post.body, testPostBody);
        })
    })

});