import { useEffect, useRef, useState } from "react";
import styles from "./AllPosts.module.css";
import PostCard from "../Components/PostCard";
import { useSelector } from "react-redux";
import axiosInstance from "../axiosInstance";
import connectSocket from "../connectSocket";

function AllPostsPage() {
    const socket = useRef(null);
    const currUser = useSelector((store) => {
        return store.userState.user;
    })
    const axios = axiosInstance();
    const [posts,setPosts] = useState([]);
    let [flag, setFlag] = useState(false);
    let [toggleLike, setLike] = useState(false);
    let [content, setContent] = useState("");
    let [file,setFile] = useState(null);
    let [uploading,setUploading] = useState(false);
    function handleContentInp(event) {
        if (event.target.value.length !== 0) {
            setFlag(true);
        } else {
            setFlag(false);
        }
        setContent(event.target.value);
    }

    function handleFileInput(e){
        setFile(e.target.files[0]);
    }

    async function createPost(){
        setUploading(true);
        if(content.length!==0 && file===null){
            const res = await axios.post(`/post/${currUser._id}/content/new`,{content});
            if(!res.data.success){
                alert("Could not  Create post!");
            }
        }
        if(content.length!==0 && file!==null){
            const formData = new FormData();
            formData.append("content",content);
            formData.append("postImg",file);
            const res = await axios.post(`/post/${currUser._id}/contentAndImg/new`,formData);
            if(!res.data.success){
                alert("Could not  Create post!");
            }
        }
        setUploading(false);
        setFile(null);
        setContent("");
        setFlag(false);
        getAllPosts();
    }

    async function getAllPosts() {
        const res = await axios.get("/post/all");
        if(res.data.posts){
            setPosts(res.data.posts);
        }
    }

    useEffect(()=>{
        socket.current = connectSocket();
        socket.current.on("comment-saved",(data)=>{
            getAllPosts();
        })
        getAllPosts();
    },[]);
        return (
            <div id={styles.AllPostsPageMainContainer}>
                {uploading &&  <span>uploading...</span>}
                {currUser !== null ? (<div id={styles.AllPostsPageAddPostContainer}>
                    <img id={styles.profilePic} src={currUser.profilePic} alt="profle pic" />
                    <textarea name="content" id={styles.postInpBox} placeholder="What's in your mind?" value={content} onChange={handleContentInp}></textarea>
                    <label htmlFor="postImg"> <i id={styles.addPostBtn} className="fa-solid fa-circle-plus"></i></label>
                    <input type="file" name="postImg" id="postImg" onChange={handleFileInput} hidden />
                    <button style={{ display: flag ? "block" : "none" }} id={styles.postBtn} onClick={createPost}>Post</button>
                </div> ): null}
                <div id={styles.allPostsContainer}>
                    {posts.length === 0 ? <h3>Loading...</h3> :  posts.map((post,indx)=>{
                        return (<PostCard key={indx} post={post} currUser={currUser} socket={socket}  getAllPosts={getAllPosts}/>);
                    })}
                </div>
            </div>
        );
}

export default AllPostsPage;
