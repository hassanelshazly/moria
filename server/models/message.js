const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;


const msgSchema = new mongoose.Schema({
    sender: {
        type: ObjectId,
        ref: "User" 
    },
    receiver: {
        type: ObjectId,
        ref: "User" 
    },
    message: String,
    seen: {
        type: Boolean,
        default: false
    }

});

module.exports = mongoose.model('Message', msgSchema);