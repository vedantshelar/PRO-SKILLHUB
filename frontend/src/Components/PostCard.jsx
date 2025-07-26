import { useEffect, useRef, useState } from "react";
import styles from "../pages/AllPosts.module.css";
import CommentBox from "./CommentBox";
import axiosInstance from "../axiosInstance";
function PostCard({ post, currUser, socket, getAllPosts }) {
    const axios = axiosInstance();
    let [isPostLike, setIsPostLike] = useState(false);
    let [toggleComment, setToggleComment] = useState(false);
    let [comment, setComment] = useState("");
    const chatContainerRef = useRef(null);
    function opentCommentBox() {
        setToggleComment(true);
    }
    function closeCommentBox() {
        setToggleComment(false);
    }
    function handleOnClickOnCommentMainContainer() {
        closeCommentBox();
    }
    function sendComment() {
        if (comment.length !== 0) {
            socket.current.emit("send-comment", { userId: currUser._id, postId: post._id, content: comment });
            setComment("");
            getAllPosts()
        } else {
            alert("Blank commnet can not be sent!");
        }
    }

    function isPostLikedByCurrUser() {
        setIsPostLike(post.likes.includes(currUser._id));
    }

    async function likeAndUnlikePost() {
        if (!isPostLike) {
            // like post 
            const res = await axios.post(`/post/${currUser._id}/${post._id}/likePost`);
            if (res.data.success) {
                setIsPostLike(true);
                getAllPosts();
            }

        } else {
            // unlike post 
            const res = await axios.post(`/post/${currUser._id}/${post._id}/unlikePost`);
            if (res.data.success) {
                setIsPostLike(false);
                getAllPosts();
            }
        }
    }

    useEffect(() => {
        // Auto-scroll to bottom
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [post]);

    useEffect(() => {
        if (currUser !== null) {
            isPostLikedByCurrUser();
        }
    }, []);
    return (
        <div className={styles.postContainer}>
            {
                toggleComment && (
                    <div onClick={handleOnClickOnCommentMainContainer} id={styles.commentMainContainer}>
                        <div onClick={(event) => { event.stopPropagation(); }} id={styles.commentContainer}>
                            <div ref={chatContainerRef} id={styles.commentScroll}>
                                {post.comments.map((comment, indx) => {
                                    return (<CommentBox comment={comment} key={indx} />)
                                })}
                            </div>
                            <div id={styles.sentCommnetBox}>
                                <input type="text" placeholder="comment" onChange={(e) => { setComment(e.target.value) }} value={comment} />
                                <button onClick={sendComment}>Send</button>
                            </div>
                            <i onClick={closeCommentBox} class="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                )
            }
            <div className={styles.postProfilePicContainer}>
                <img className={styles.postProfilePic} src={post.owner.profilePic} alt="profle pic" />
            </div>
            <div className={styles.postInfoContainer}>
                <p className={styles.postName}>{post.owner.name}</p>
                <p className={styles.postUserName}>{post.owner.username}</p>
                <p className={styles.postContent}>{post.content}</p>
                {post.postImg.url !== "" && <img src={post.postImg.url} alt="post image" className={styles.postImg} />}
                {currUser !== null && (<div className={styles.postMediaControls}>
                    {isPostLike ? <span className={styles.likeBtn}><i onClick={likeAndUnlikePost} className="fa-solid fa-heart" style={{ color: "#ff2465" }}></i>{post.likes.length}</span> : <span className={styles.likeBtn}><i onClick={likeAndUnlikePost} className="fa-regular fa-heart"></i>{post.likes.length}</span>}
                    <span className={styles.commentsBtn} onClick={opentCommentBox}><i className="fa-regular fa-comment"></i>{post.comments.length}</span>
                    <span className={styles.shareBtn}><i className="fa-solid fa-share-nodes"></i></span>
                </div>)}
            </div>
        </div>
    );
}

export default PostCard;