import styles from "../pages/DiscoverPage.module.css";
import axiosInstance from "../axiosInstance";
import {useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchUser } from "../../slices/userSlice";

function ConnectionCard({followerRequestUser,currUserId,flag,isFollwingCard}) {
    const axios = axiosInstance();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    async function acceptFollowRequest() {
        const res = await axios.post(`/user/${currUserId}/${followerRequestUser._id}/followRequest/accept`);
        if(!res.data.success){
            alert("Cloud not accept follower request please try again!");
        }
        dispatch(fetchUser());
    }
    async function rejectFollowRequest() {
        const res = await axios.post(`/user/${currUserId}/${followerRequestUser._id}/followRequest/reject`);
        if(!res.data.success){
            alert("Cloud not reject follower request please try again!");
        }
        dispatch(fetchUser());
    }
    async function removeFollower() {
        const res = await axios.post(`/user/${currUserId}/${followerRequestUser._id}/followers/remove`);
        if(!res.data.success){
            alert("Cloud not remove follower!");
        }
        dispatch(fetchUser());
    }

    async function unFollowUser() {
        const res = await axios.post(`/user/${currUserId}/${followerRequestUser._id}/unfollow`);
        if(!res.data.success){
            alert("Cloud not unfollow user!");
        }
        dispatch(fetchUser());
    }

    function navigateToChatWindow(){
        navigate(`/${currUserId}/${followerRequestUser._id}/${followerRequestUser.name}/${followerRequestUser.username}/chat`);
    }
    if(followerRequestUser!==null){
        return (
            <div className={styles.discoverCard}>
                <img className={styles.discoverCardImg} src={followerRequestUser.profilePic} alt="profile img" />
                <div className={styles.discoverCardInfoSection}>
                    <p className={styles.discoverCardName}>{followerRequestUser.name}</p>
                    <p className={styles.discoverCardUsername}>{followerRequestUser.username}</p>
                </div>
                <div className={styles.discoverAcceptRejectContainer}>
                    {flag ? <> <button className={styles.acceptBtn} onClick={acceptFollowRequest}>Accept</button>
                    <button className={styles.rejectBtn} onClick={rejectFollowRequest}>Reject</button></>: isFollwingCard ? <button className={styles.acceptBtn} onClick={unFollowUser}>unfollow</button> : <button className={styles.acceptBtn} onClick={removeFollower}>Remove</button>}
                    {!flag && <button className={styles.acceptBtn} onClick={navigateToChatWindow}>Chat</button>}
                </div>
            </div>
        );
    }else{
        return <h1>Loading...</h1>
    }
}

export default ConnectionCard;