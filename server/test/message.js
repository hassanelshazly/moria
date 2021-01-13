const dotenv = require('dotenv').config();
const assert = require('assert');
const mongoose = require('mongoose');
const Msg = require("../data/message");
const User = require("../data/user");

describe("Message", () => {
    before(async function () {
        this.timeout(10000);
        try {
            await mongoose.connect(process.env.MONGO_URI_TEMP, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            });
        } catch {
            console.error("Database connection error");
        }

        testName1 = "Test User 1";
        testUsername1 = "hos22";
        testEmail1 = "hos22@gmail.com";
        testPassword1 = "12345678";
        
        const user1 = await User.register({
            fullname: testName1,
            username: testUsername1,
            email: testEmail1,
            password: testPassword1,
        });
        testMessage1 = "hey there 1 !";
        testUserId1 = user1._id;

        testName2 = "Test User 2";
        testUsername2 = "mo22";
        testEmail2 = "mo22@gmail.com";
        testPassword2 = "87654321";
        
        const user2 = await User.register({
            fullname: testName2,
            username: testUsername2,
            email: testEmail2,
            password: testPassword2,
        });
        testUserId2 = user2._id;
    
    });

    after(async () => {
        await User.deleteOne({ username: testUsername1 });
        await User.deleteOne({ username: testUsername2 });

    });

    describe("#sendmessage()", () => {
        beforeEach(async () => {
            await User.deleteOne({ user1: testUserId1 });
            await User.deleteOne({ user2: testUserId2 });
        });

        afterEach(async () => {
            await User.deleteOne({ user1: testUserId1 });
            await User.deleteOne({ user2: testUserId2 });
        });

        it("User send message", async () => {
            const msg = await Msg.sendMessage({
                userId: testUserId1,
                toUserId: testUserId2,
                body: testMessage1
            });

            const dbMsg = await Msg.findById(msg._id);
            assert.ok(dbMsg);

            assert.strictEqual(msg.body, dbMsg.body);
        });

    });
});