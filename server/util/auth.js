const jwt = require('jsonwebtoken');
const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const { Strategy: GoogleTokenStrategy } = require('passport-google-token');

function getAuthUser(context) {
    const authHeader = context.req?.headers.authorization;
    const authConnection = context.connection?.context.authorization;
    const authToken = authHeader || authConnection;

    if (!authToken)
        throw new Error('Authorization header must be provided');

    // Bearer ....
    const token = authToken.split('Bearer ')[1];
    if (!token)
        throw new Error("Authentication token must be 'Bearer [token]");

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return user;
    } catch (err) {
        throw new Error('Invalid/Expired token');
    }
}

// FACEBOOK STRATEGY
function FacebookStrategy(accessToken, refreshToken, profile, done) {
    return done(null, {
        accessToken,
        refreshToken,
        profile,
    });
}

passport.use(new FacebookTokenStrategy({
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_SECRET,
}, FacebookStrategy));

// GOOGLE STRATEGY
function GoogleStrategy(accessToken, refreshToken, profile, done) {
    return done(null, {
        accessToken,
        refreshToken,
        profile,
    });
}

passport.use(new GoogleTokenStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
}, GoogleStrategy));

// promisified authenticate functions
function authFacebook(req, res) {
    return new Promise((resolve, reject) => {
        passport.authenticate('facebook-token',
            { session: false },
            (err, data, info) => {
                if (err) reject(err);
                resolve({ data, info });
            })(req, res);
    });
}

function authGoogle(req, res) {
    return new Promise((resolve, reject) => {
        passport.authenticate('google-token',
            { session: false },
            (err, data, info) => {
                if (err) reject(err);
                resolve({ data, info });
            })(req, res);
    });
}


module.exports = {
    authGoogle,
    getAuthUser,
    authFacebook
}
