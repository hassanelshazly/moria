const mongoose=  require("mongoose");

const pageSchema = new mongoose.Schema({

    pageTitle:String,
    pageDesc:String,
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    followers:[ { 
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }] ,
    followersCount:Number,
    pagePost:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },

});

module.exports = pageSchema;