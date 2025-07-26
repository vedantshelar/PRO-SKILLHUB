require('dotenv').config();
const express = require("express");
const router = express.Router();
const upload = require('../configuration/multer'); // multer
const { isAuthenticatedUser, isPostOwner } = require('../utils');
const { getAllPosts, createNewPost, likePost, unlikePost, uploadPostImgAndContent } = require('../controllers/postControllers');

router.get("/all", getAllPosts);

router.post("/:userId/content/new",isAuthenticatedUser,isPostOwner, createNewPost)

router.post("/:userId/:postId/likePost",isAuthenticatedUser, likePost)

router.post("/:userId/:postId/unlikePost",isAuthenticatedUser, unlikePost)

router.post("/:userId/contentAndImg/new",isAuthenticatedUser,isPostOwner,upload.single("postImg"),uploadPostImgAndContent);

module.exports = router;