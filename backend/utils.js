require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('./models/User');

function createJWTToken(userId){
   const token = jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: '1d' });
   return token;
}

function isAuthenticatedUser(req,res,next){
    const token = req.cookies.token;
    if(token){
        next();
    }else{
        res.json({error:"You are not authenticated!"});
    }
}

function getUserIdFromJWTToken(req){
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
}

async function isProfileOwner(req,res,next) {
    try {
        const userId = req.params.userId;
        const jwtTokenUserId = getUserIdFromJWTToken(req);
        const user = await User.findById(userId);
        if (user) {
            if (user._id.toString() === jwtTokenUserId) {
                next();
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

async function isPostOwner(req,res,next) {
    try {
        const userId = req.params.userId;
        const jwtTokenUserId = getUserIdFromJWTToken(req);
        const user = await User.findById(userId);
        if (user) {
            if (user._id.toString() === jwtTokenUserId) {
                next();
            } else {
              res.json({ error: "You are not owner of this post!" });
            }
          } else {
            res.json({ error: "user does not exits!" });
          }
    } catch (error) {
        next(error);
    }
}

module.exports ={
    createJWTToken,
    getUserIdFromJWTToken,
    isAuthenticatedUser,
    isProfileOwner,
    isPostOwner
}