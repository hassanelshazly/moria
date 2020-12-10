const jwt = require('jsonwebtoken');

function getUsername(context) {
    try {
        const authHeader = context.req.headers.authorization;
        if (!authHeader)
            throw new Error('Authorization header must be provided');

        // Bearer ....
        const token = authHeader.split('Bearer ')[1];
        if (!token)
            throw new Error("Authentication token must be 'Bearer [token]");

        const user = jwt.verify(token, process.env.JWT_SECRET);
        return user;

    } catch (err) {
        throw new Error('Invalid/Expired token');
    }
};

module.exports = {
    getUsername
}
