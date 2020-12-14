var mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

var EventSchema = new mongoose.Schema({
    pagePost: [{
      type: ObjectId,
      ref: 'Post'
    }],
    location: String,
    time: String
});

module.exports = EventSchema;