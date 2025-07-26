const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Number, 
        default: () => Date.now()
      },
    postImg: {
        url: {
            type: String,
            default: ""
        },
        public_id: {
            type: String,
        }
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment" 
        }
    ]
})

module.exports = postSchema;