const dotenv = require('dotenv').config()
const assert = require('assert')
const mongoose = require('mongoose')
const User = require("../data/user")
const Group = require("../data/group")
const { ObjectId } = mongoose.Types;

describe("Group", () => {
    before(async function () {
        this.timeout(5000);
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

        const user = await User.register({
            fullname: testName,
            username: testUsername,
            email: testEmail,
            password: testPassword,
        })
        testUserId = user._id;

        testGroupTitle = "thistitleisfortesingpurposandwhateverthisthinguse";
    })

after(async () => {
    await User.deleteOne({ username: testUsername })
})

describe("#creatGroup()", () => {
    beforeEach(async () => {
        await Group.deleteMany({ admin : testUserId });
    });

    afterEach(async () => {
        await Group.deleteMany({ admin : testUserId });
    });

    it("Normal Group Creation", async () => {
        const group = await Group.createGroup({
            title:  testGroupTitle,
            adminId: testUserId
        })
        assert.ok(group)

        const dbGroup= await Group.findById(group._id);
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
        const group = await Group.createGroupPost({
            title: testGroupTitle,
            adminId: testUserId
        })

        testGroupId = group._id;
    })

    afterEach(async () => {
        await Group.deleteMany({ admin : testUserId });
    })


    it("Normal Group Post Creation", async () => {
        const group = await Post.createGroupPost({
            adminId: testUserId,
            groupId: testGroupId,
            title: testGroupTitle
        })

        assert.ok(group);
        assert.strictEqual(group.posts.length, 1);
        assert.strictEqual(group.posts[0].body, testGroupTitle);
    })
})

})