const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: {
        type: String,
        default:"Hey you can add your bio here"
    },
    profilePic: {
        type: String,
        default: "/defaultProfile.avif"
    },
    profilePic_public_id:{
        type:String,
        default:""
    },
    profileBgImg: {
        type: String,
        default: "/profileBgImg1.webp"
    },
    profileBgImg_public_id:{
        type:String,
        default:""
    },
    createdAt: {
        type: String,
        default: () => new Date().toLocaleDateString()
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    followersRequests:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    professions:[
        {
            type:String
        }
    ],
    works:[
        {
            name:String,
            position:String,
            experience:Number
        }
    ],
    projects:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    }]
})

module.exports=userSchema;