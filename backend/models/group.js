const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const groupSchema = new mongoose.Schema({
    title:{
        type: String,
        default: "Moria"
    },
    members: [{ type: ObjectId, ref: "User" }],
    created: {
        type: Date,
        default: Date.now
    },

});

module.exports = mongoose.model('Group', groupSchema);