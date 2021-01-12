const dotenv = require('dotenv').config()
const assert = require('assert')
const mongoose = require('mongoose')
const User = require("../data/user")
const Post = require("../data/user")
const Group = require("../data/group")
const { ObjectId } = mongoose.Types;

describe("Group", () => {
    before(async function () {
        this.timeout(10000);
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
        testMembername = "testmemberuserusernamerandomone";
        testEmail = "testuserusernamerandomone@gmail.com";
        testMemberEmail = "testmemberusernamerandomone@gmail.com";
        testPassword = "123456789";

        let user;
        let member
        try {
            user = await User.register({
                fullname: testName,
                username: testUsername,
                email: testEmail,
                password: testPassword,
            });

            member = await User.register({
                fullname: testName,
                username: testMembername,
                email: testMemberEmail,
                password: testPassword,
            });
        } catch (err) {
            await User.deleteOne({ username: testUsername })
            await User.deleteOne({ username: testMembername })
            assert.fail(err);
        }
        testUserId = user._id;
        testGroupTitle = "Group Title";

        testMembersId = [member._id];
    })

    after(async () => {
        await User.deleteOne({ username: testUsername })
        await User.deleteOne({ username: testMembername })
    })

    describe("#creatGroup()", () => {
        beforeEach(async () => {
            await Group.deleteMany({ admin: testUserId });
        });

        afterEach(async () => {
            await Group.deleteMany({ admin: testUserId });
        });

        it("Normal Group Creation", async () => {
            const group = await Group.createGroup({
                title: testGroupTitle,
                userId: testUserId,
                membersId: testMembersId
            })
            assert.ok(group)

            const dbGroup = await Group.findById(group._id);
            assert.ok(dbGroup)

            assert.strictEqual(group.title, dbGroup.title);
        })

        it("Not Providing Id", async () => {
            try {
                const group = await Group.createGroup({
                    title: testGroupTitle
                })
                assert.fail("Group Without userId has been accepted");
            } catch {
                const group = await Group.findOne({ title: testGroupTitle });
                if (group)
                    assert.fail("Wrong data has been stored in db");
            }
        })
    })

    describe("#createGroupPost()", async () => {
        beforeEach(async () => {
            const group = await Group.createGroup({
                title: testGroupTitle,
                userId: testUserId,
                membersId: testMembersId
            })

            testGroupId = group._id;
        })

        afterEach(async () => {
            await Post.deleteMany({ user: testUserId });
            await Group.deleteMany({ admin: testUserId });
        })


        it("Normal Group Post Creation", async () => {
            const post = await Group.createGroupPost({
                userId: testUserId,
                groupId: testGroupId,
                body: testGroupTitle
            })

            assert.ok(post);
            assert.strictEqual(post.body, testGroupTitle);
        })
    })

})