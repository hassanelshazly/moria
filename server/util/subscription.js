const { PubSub } = require('apollo-server');

const pubSub = new PubSub();

const NEW_MESSAGE = 'NEW_MESSAGE';
const NEW_CONVERSATION = 'NEW_CONVERSATION';

const NEW_NOTIFICATION = 'NEW_NOTIFICATION';

module.exports = {
    pubSub,
    NEW_MESSAGE,
    NEW_CONVERSATION,
    NEW_NOTIFICATION
}