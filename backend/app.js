require('dotenv').config();
const express = require('express');
const http = require("http");
const { Server } = require("socket.io");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const Post = require("./models/Post");
const Comment = require("./models/Comment");
const Message = require('./models/Message');

const app = express();

//middlewares

app.use(express.static("public"));
app.use(cookieParser());
app.use(cors({
  origin: process.env.REACT_APP_URL,
  credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

mongoose.connect(process.env.DB_URL)
  .then(() => console.log('Connected To PRO_SKILLHUB DB')).catch((error) => {
    console.log("Error Occured While Making Connection with PRO_SKILLHUB DB!");
  });

server.listen(process.env.PORT_NO, () => {
  console.log(`SERVER IS LISTING ON PORT NO ${process.env.PORT_NO}`);
})

// socket 

const io = new Server(server, {
  cors: {
    origin: process.env.REACT_APP_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  },
});

const userIdToSocketMap = {};

io.on("connection",(socket) => {
  socket.on("map",(senderId)=>{
    userIdToSocketMap[senderId] = socket.id;
  })
  socket.on("send-comment",async({userId,postId,content})=>{
    let comment = new Comment({owner:userId,content:content});
    comment = await comment.save();
    await Post.findByIdAndUpdate(postId,{$push:{comments:comment._id}})
    io.emit("comment-saved",comment);
  });

  socket.on("send-message",async({senderId,receiverId,message})=>{
    const messageObj = new Message({sender:senderId,receiver:receiverId,content:message});
    await messageObj.save();
    if(userIdToSocketMap[receiverId]){
      let receiverSocketId = userIdToSocketMap[receiverId];
      socket.to(receiverSocketId).emit("receive-message",message);
    }
  })
});

// app routes 

app.use("/user", userRoutes);
app.use("/post", postRoutes);


//error handler middleware 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.json({ error: "Error Occured : ", err });
});
