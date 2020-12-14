var mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

var LikeSchema = new mongoose.Schema({
    likeBy: [{ //array of objects
      type: ObjectId,
      ref: 'User'
    }],
    score: Number
});

module.exports = LikeSchema;