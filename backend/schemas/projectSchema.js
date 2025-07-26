const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name:String,
    description:String,
    thumbanail:{
        url:{
            type:String,
            default:"/defaultProjectthumbanail.jpg"
        },
        public_id:String
    },
    projectImgs:[{
        url:String,
        public_id:String
    }],
})

module.exports = projectSchema;