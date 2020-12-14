const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

var commentSchema = new mongoose.Schema({
    likeBy:[{
        type:ObjectId,
        ref:'User'
    }],
    replyTo:{
        type:ObjectId,
        ref:'Comment'
    }
});

module.exports = commentSchema;