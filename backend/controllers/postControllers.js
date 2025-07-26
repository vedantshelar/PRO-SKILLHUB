require('dotenv').config();
const Post = require("../models/Post");
const cloudinary = require('../configuration/cloudinary'); // cloudinary config

const getAllPosts = async(req,res,next)=>{
    try {
        const posts = await Post.find({}).sort({createdAt:-1}).populate("owner").populate({
            path: "comments",
            populate: {
              path: "owner",    
              model: "User",
              select:"name username"
            }
          });;
        res.json({posts})
    } catch (error) {
        next(error);
    }
}

const createNewPost = async(req,res,next)=>{
    try {
        const {content} = req.body;
        let post = new Post({content,owner:req.params.userId});
        post = await post.save();
        res.json({success:"Post has been created!"});
    } catch (error) {
        next();
    }
};

const likePost = async(req,res,next)=>{
    try {
        const userId = req.params.userId;
        const postId = req.params.postId;
        await Post.findByIdAndUpdate(postId,{$addToSet:{likes:userId}});
        res.json({success:"Post has been liked!"});
    } catch (error) {
        next(error);
    }
}

const unlikePost = async(req,res,next)=>{
    try {
        const userId = req.params.userId;
        const postId = req.params.postId;
        await Post.findByIdAndUpdate(postId,{$pull:{likes:userId}});
        res.json({success:"Post has been unliked!"});
    } catch (error) {
        next(error);
    }
};

const uploadPostImgAndContent = async(req,res,next)=>{
    try {
        const {content} = req.body;
        const result = await cloudinary.uploader.upload_stream(
            { folder: process.env.CLOUDINARY_FOLDER_NAME },
            async (error, result) => {
              if (error) {
                res.json({ error: "Cloudn't upload post image!" });
              } else {
                const post = new Post({content,postImg:{url:result.secure_url,public_id:result.public_id}});
                post.owner = req.params.userId;
                await post.save();
                res.json({ success: "Post has been created!" });
              }
            }
          );
          result.end(req.file.buffer);
    } catch (error) {
        next();
    }
};

module.exports = {
    getAllPosts,
    createNewPost,
    likePost,
    unlikePost,
    uploadPostImgAndContent
}