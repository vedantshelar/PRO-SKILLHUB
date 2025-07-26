require('dotenv').config();
const User = require("../models/User");
const Project = require("../models/Project");
const bcrypt = require('bcrypt');
const { createJWTToken, getUserIdFromJWTToken } = require("../utils");
const cloudinary = require('../configuration/cloudinary'); // cloudinary config
const Message = require('../models/Message');

const signup = async (req, res, next) => {
    try {
        let { username, name, email, password } = req.body;
        username = "@" + username;
        let user = await User.findOne({ username });
        if (user) {
            return res.json({ error: "Username has been already taken!" });
        }
        password = await bcrypt.hash(password, 10);
        user = new User({ username, name, email, password });
        await user.save();
        const token = createJWTToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,         // ok in dev
            sameSite: 'none',       // allows cookie on same-origin or GET cross-origin
            maxAge: 24 * 60 * 60 * 1000 //1d
        });
        res.json({ success: "User Account Has Been Created Successfully!" });
    } catch (error) {
        next(error);
    }
}

const signin = async (req, res, next) => {
    try {
        let { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: "Invalid Email!" });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.json({ error: "Invalid Password!" });
        }
        const token = createJWTToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,         // ok in dev
            sameSite: 'none',       // allows cookie on same-origin or GET cross-origin
            maxAge: 24 * 60 * 60 * 1000 //1d
        });
        res.json({ success: "You are logged in Successfully!" });
    } catch (error) {
        next(error);
    }
}

const logout = async (req, res, next) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });
        res.json({ success: "You are logged out Successfully!" });
    } catch (error) {
        next(error)
    }
}

const getCurrUser = async (req, res, next) => {
    try {
        const userId = getUserIdFromJWTToken(req);
        const user = await User.findById(userId).populate("projects").populate("followers").populate("following").populate("followersRequests");
        res.json(user);
    } catch (error) {
        next(error);
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json({ users })
    } catch (error) {
        next()
    }
}

const getProfileByUserId = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate("projects");
        return res.json({ user });
    } catch (error) {
        next(error)
    }
}

const getSendersAndReceiversChats = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const receiverId = req.params.receiverId;
        const messages = await Message.find({ $or: [{ sender: userId, receiver: receiverId }, { sender: receiverId, receiver: userId }] }).sort({ createdAt: 1 });
        return res.json({ messages });
    } catch (error) {
        next(error)
    }
}

const makeFollowRequest = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const profileUserId = req.params.profileUserId;
        await User.findByIdAndUpdate(profileUserId, { $addToSet: { followersRequests: userId } })

        res.json({ success: "Follow Request Has Been sent!" });
    } catch (error) {
        next(error)
    }
}

const acceptFollowRequest = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const profileUserId = req.params.profileUserId;

        await User.findByIdAndUpdate(userId, { $addToSet: { followers: profileUserId }, $pull: { followersRequests: profileUserId } })
        await User.findByIdAndUpdate(profileUserId, { $addToSet: { following: userId } });

        res.json({ success: "Follow Request Has Been Accepted!" });
    } catch (error) {
        next(error)
    }
}

const rejectFollowRequest = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const profileUserId = req.params.profileUserId;

        await User.findByIdAndUpdate(userId, { $pull: { followersRequests: profileUserId } })

        res.json({ success: "Follow Request Has Been Rejected!" });
    } catch (error) {
        next(error)
    }
}

const removeFollower = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const profileUserId = req.params.profileUserId;

        await User.findByIdAndUpdate(userId, { $pull: { followers: profileUserId } })
        res.json({ success: "User has been removed from your followers list!" });
    } catch (error) {
        next(error)
    }
}

const unFollowUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const profileUserId = req.params.profileUserId;

        await User.findByIdAndUpdate(userId, { $pull: { following: profileUserId } });
        await User.findByIdAndUpdate(profileUserId, { $pull: { followers: userId } });
        res.json({ success: "You unfollowed one user!" });
    } catch (error) {
        next(error)
    }
}

const uploadProfilePic = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await cloudinary.uploader.upload_stream(
            { folder: process.env.CLOUDINARY_FOLDER_NAME },
            async (error, result) => {
                if (error) {
                    res.json({ error: "Cloudn't update profile image! please try it again!" });
                } else {
                    const user = await User.findById(userId);
                    const previous_profilePic_public_id = user.profilePic_public_id;
                    const jwtTokenUserId = getUserIdFromJWTToken(req);
                    if (user._id.toString() === jwtTokenUserId) {
                        user.profilePic = result.secure_url;
                        user.profilePic_public_id = result.public_id;
                        await user.save();
                        if (previous_profilePic_public_id.length !== 0) {
                            await cloudinary.uploader.destroy(previous_profilePic_public_id);
                        }
                        res.json({ success: "Profile image has been updated successfully!" });
                    } else {
                        res.json({ error: "You are not owner of this profile!" });
                    }
                }
            }
        );
        result.end(req.file.buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const uploadProfileBackgroundImg = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await cloudinary.uploader.upload_stream(
            { folder: process.env.CLOUDINARY_FOLDER_NAME },
            async (error, result) => {
                if (error) {
                    res.json({ error: "Cloudn't update profile backgroud image! please try it again!" });
                } else {
                    const user = await User.findById(userId);
                    const previous_profileBgImg_public_id = user.profileBgImg_public_id;
                    const jwtTokenUserId = getUserIdFromJWTToken(req);
                    if (user._id.toString() === jwtTokenUserId) {
                        user.profileBgImg = result.secure_url;
                        user.profileBgImg_public_id = result.public_id;
                        await user.save();
                        if (previous_profileBgImg_public_id.length !== 0) {
                            await cloudinary.uploader.destroy(previous_profileBgImg_public_id);
                        }
                        res.json({ success: "Profile background image has been updated successfully!" });
                    } else {
                        res.json({ error: "You are not owner of this profile!" });
                    }
                }
            }
        );
        result.end(req.file.buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateUserNameAndBio = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const jwtTokenUserId = getUserIdFromJWTToken(req);
        const user = await User.findById(userId);
        if (user) {
            if (user._id.toString() === jwtTokenUserId) {
                const { name, bio } = req.body;
                await User.findByIdAndUpdate(jwtTokenUserId, { name, bio });
                res.json({ success: "User name or bio has been updated!" });
            } else {
                res.json({ error: "You are not owner of this profile!" });
            }
        } else {
            res.json({ error: "user does not exits!" });
        }
    } catch (error) {
        next(error);
    }
}

const addProfession = async (req, res, next) => {
    try {
        const userId = getUserIdFromJWTToken(req);
        const { profession } = req.body;

        const user = await User.findByIdAndUpdate(userId, { $push: { professions: profession.toUpperCase() } });
        res.json({ success: profession + " has been added!" });
    } catch (error) {
        next(error);
    }
}

const destroyProfession = async (req, res, next) => {
    try {
        const userId = getUserIdFromJWTToken(req);
        const { profession } = req.body;
        const user = await User.findByIdAndUpdate(userId, { $pull: { professions: profession } });
        res.json({ success: profession + " has been removed!" });
    } catch (error) {
        next(error);
    }
}

const addWork = async (req, res, next) => {
    try {
        const userId = getUserIdFromJWTToken(req);
        const { name, position, experience } = req.body;

        const user = await User.findByIdAndUpdate(userId, {
            $push: {
                works: {
                    name: name.toUpperCase(),
                    position: position,
                    experience: experience
                }
            }
        });
        res.json({ success: "work has been added!" });
    } catch (error) {
        next(error);
    }
}

const destroyWork = async (req, res, next) => {
    try {
        const userId = getUserIdFromJWTToken(req);
        const { workId } = req.body;
        await User.findByIdAndUpdate(userId, {
            $pull: {
                works: { _id: workId }
            }
        });
        res.json({ success: "work has been deleted!" });
    } catch (error) {
        next(error);
    }
}

const createProject = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const { name, description } = req.body;
        let newProject = new Project({ name, description });
        newProject = await newProject.save();
        await User.findByIdAndUpdate(userId, { $push: { projects: newProject._id } });
        res.json({ projectId: newProject._id });
    } catch (error) {
        next(error);
    }
}

const destroyProject = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const project = await Project.findByIdAndDelete(projectId)
        if (project.thumbanail.public_id) {
            await cloudinary.uploader.destroy(project.thumbanail.public_id);
        }
        if (project.projectImgs.length !== 0) {
            for (projectImg of project.projectImgs) {
                await cloudinary.uploader.destroy(projectImg.public_id);
            }
        }
        res.json({ success: "Project has been deleted!" })
    } catch (error) {
        next(error);
    }
}

const uploadProjectThumbanail = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const projectId = req.params.projectId;
        const project = await Project.findById(projectId);
        if (project) {
            const result = await cloudinary.uploader.upload_stream(
                { folder: process.env.CLOUDINARY_FOLDER_NAME },
                async (error, result) => {
                    if (error) {
                        res.json({ error: "Cloudn't upload project Thumbanail image! please try it again!" });
                    } else {
                        project.thumbanail.url = result.secure_url;
                        project.thumbanail.public_id = result.public_id;
                        await project.save();
                        res.json({ success: "Project Thumbanail has been uploaded!" });
                    }
                }
            );
            result.end(req.file.buffer);
        } else {
            res.json({ error: "User does not exists!" });
        }
    } catch (error) {
        next(error);
    }
}

const uploadProjectImages = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const projectId = req.params.projectId;
        const project = await Project.findById(projectId);
        if (project) {
            const uploadedImages = [];

            for (let file of req.files) {
                const result = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, async (error, result) => {
                    if (error) return console.error(error);
                    uploadedImages.push({
                        url: result.secure_url,
                        public_id: result.public_id
                    });

                    if (uploadedImages.length === req.files.length) {
                        project.projectImgs = uploadedImages;
                        await project.save();
                        return res.json({ success: "Project Images has been uploaded!" });
                    }
                }).end(file.buffer);
            }
        } else {
            res.json({ error: "User does not exists!" });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signup,
    signin,
    logout,
    getCurrUser,
    getAllUsers,
    getProfileByUserId,
    getSendersAndReceiversChats,
    makeFollowRequest,
    acceptFollowRequest,
    rejectFollowRequest,
    removeFollower,
    unFollowUser,
    uploadProfilePic,
    uploadProfileBackgroundImg,
    updateUserNameAndBio,
    addProfession,
    destroyProfession,
    addWork,
    destroyWork,
    createProject,
    destroyProject,
    uploadProjectThumbanail,
    uploadProjectImages
}