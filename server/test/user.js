const dotenv = require('dotenv').config();
const assert = require('assert');
const mongoose = require('mongoose');
const User = require("../data/user");

describe("User", () => {
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
        testWrongUsername = "notyatestuserusernamerandomone";
        testEmail = "testuserusernamerandomone@gmail.com";
        testWrongEmail = "wrongone";
        testPassword = "123456789";
        testWrongPassword = "123456798";
    });

    after(async () => {
        await User.deleteOne({ username: testUsername });
    });

    describe("#register()", () => {
        beforeEach(async () => {
            await User.deleteOne({ username: testUsername });
        });

        afterEach(async () => {
            await User.deleteOne({ username: testUsername });
        });

        it("User normal registation", async () => {
            const user = await User.register({
                fullname: testName,
                username: testUsername,
                email: testEmail,
                password: testPassword,
            });
            assert.ok(user);

            const dbUser = await User.findById(user._id);
            assert.ok(dbUser);

            assert.strictEqual(user.email, dbUser.email);
            assert.notStrictEqual(user.token, dbUser.activationToken);
        });

        it("Wrong email registation", async () => {
            try {
                await User.register({
                    fullname: testName,
                    username: testUsername,
                    email: testWrongEmail,
                    password: testPassword,
                })
                assert.fail("Wrong email has been accepted");
            } catch {
                const user = await User.findOne({ username: testUsername });
                if (user)
                    assert.fail("Wrong data has been stored in db");
            }
        });

        it("More than one person registation", async () => {
            try {
                await User.register({
                    fullname: testName,
                    username: testUsername,
                    email: testEmail,
                    password: testPassword,
                })

                await User.register({
                    fullname: testName,
                    username: testUsername,
                    email: testEmail,
                    password: testPassword,
                })

                assert.fail("more than one person has been accepted");
            } catch {
                assert.ok(true);
            }
        });
    });


    describe("#login()", async () => {
        beforeEach(async () => {
            await User.register({
                fullname: testName,
                username: testUsername,
                email: testEmail,
                password: testPassword,
            });
        });

        afterEach(async () => {
            await User.deleteOne({ username: testUsername });
        });


        it("Normal login", async () => {
            const user = await User.login({
                username: testUsername,
                password: testPassword,
            });

            assert.ok(user);
            assert.strictEqual(user.fullname, testName);
            assert.strictEqual(user.email, testEmail);
        });

        it("Wrong Username", async () => {
            try {
                const user = await User.login({
                    username: testWrongUsername,
                    password: testPassword,
                });

                assert.fail("Wrong Username has been accepted");
            } catch {
                assert.ok(true);
            }
        });

        it("Wrong Password", async () => {
            try {
                const user = await User.login({
                    username: testUsername,
                    password: testWrongPassword,
                });

                assert.fail("Wrong Password has been accepted");
            } catch {
                assert.ok(true);
            }
        });
    });
});