const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const groupSchema = new mongoose.Schema({
    groupTitle:{
        type: String,
        default: "Moria",
        required:true
    },
    groupDesc:String,
    groupAdmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    groupMembers: [ { type: ObjectId, ref: "User" } ],
    groupPost:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Group', groupSchema);