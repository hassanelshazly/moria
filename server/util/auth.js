const jwt = require('jsonwebtoken');

function getAuthUser(context) {
    try {
        const authHeader = context.req?.headers.authorization;
        const authConnection = context.connection?.context.authorization;
        const authToken = authHeader || authConnection;
        
        if (!authToken)
            throw new Error('Authorization header must be provided');

        // Bearer ....
        const token = authToken.split('Bearer ')[1];
        if (!token)
            throw new Error("Authentication token must be 'Bearer [token]");

        const user = jwt.verify(token, process.env.JWT_SECRET);
        return user;

    } catch (err) {
        throw new Error('Invalid/Expired token');
    }
};

module.exports = {
    getAuthUser
}
