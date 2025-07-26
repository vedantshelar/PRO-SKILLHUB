const mongoose = require("mongoose");
const commentSchema = require("../schemas/commentSchema");

const Comment = mongoose.model("Comment",commentSchema);

module.exports = Comment;