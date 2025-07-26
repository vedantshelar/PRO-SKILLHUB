require('dotenv').config();
const express = require("express");
const bcrypt = require('bcrypt');
const { isAuthenticatedUser, isProfileOwner } = require("../utils");
const router = express.Router();
const upload = require('../configuration/multer'); // multer
const { signup, signin, logout, getCurrUser, getAllUsers, getProfileByUserId, getSendersAndReceiversChats, makeFollowRequest, acceptFollowRequest, rejectFollowRequest, removeFollower, unFollowUser, uploadProfilePic, uploadProfileBackgroundImg, updateUserNameAndBio, addProfession, destroyProfession, addWork, destroyWork, createProject, destroyProject, uploadProjectThumbanail, uploadProjectImages } = require("../controllers/userControllers");

router.post("/signup", signup);

router.post("/signin", signin);

router.get("/logout", isAuthenticatedUser, logout);

router.get("/currUser", isAuthenticatedUser, getCurrUser)

router.get(`/all`, getAllUsers)

router.get(`/:userId/profile`, getProfileByUserId)

router.get(`/:userId/:receiverId/chats`, isAuthenticatedUser, isProfileOwner, getSendersAndReceiversChats)

router.post(`/:userId/:profileUserId/followRequest`, isAuthenticatedUser, makeFollowRequest)

router.post(`/:userId/:profileUserId/followRequest/accept`, isAuthenticatedUser, isProfileOwner, acceptFollowRequest)

router.post(`/:userId/:profileUserId/followRequest/reject`, isAuthenticatedUser, isProfileOwner, rejectFollowRequest)

router.post(`/:userId/:profileUserId/followers/remove`, isAuthenticatedUser, isProfileOwner, removeFollower)

router.post(`/:userId/:profileUserId/unfollow`, isAuthenticatedUser, isProfileOwner, unFollowUser)

router.post('/:userId/upload-profilePic', isAuthenticatedUser, upload.single('profilePic'), uploadProfilePic);

router.post('/:userId/upload-profileBgImg', isAuthenticatedUser, upload.single('profileBgImg'), uploadProfileBackgroundImg);

router.put(`/:userId/nameBio`, isAuthenticatedUser, updateUserNameAndBio);

router.post(`/:userId/professions`, isAuthenticatedUser, isProfileOwner, addProfession);

router.delete(`/:userId/professions`, isAuthenticatedUser, isProfileOwner, destroyProfession);

router.post(`/:userId/works`, isAuthenticatedUser, isProfileOwner, addWork);

router.delete(`/:userId/works`, isAuthenticatedUser, isProfileOwner, destroyWork)

router.post(`/:userId/project/data`, isAuthenticatedUser, isProfileOwner, createProject)

router.delete(`/:userId/project/:projectId`, isAuthenticatedUser, isProfileOwner, destroyProject)

router.post(`/:userId/:projectId/uploadProjectThumbanail`, isAuthenticatedUser, isProfileOwner, upload.single('thumbanail'), uploadProjectThumbanail)

router.post(`/:userId/:projectId/uploadProjectImages`, isAuthenticatedUser, isProfileOwner, upload.array("images", 10), uploadProjectImages)


module.exports = router;