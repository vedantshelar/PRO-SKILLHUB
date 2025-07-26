import { useSelector } from "react-redux";
import ConnectionCard from "../Components/ConnectionCard";
import SearchBox from "../Components/SearchBox";
import styles from "./DiscoverPage.module.css";
import { useEffect, useState } from "react";

function MyConnectionsPage() {
    const currUser = useSelector((store) => {
        return store.userState.user;
    })
    let [searchValue1,setSearchValue1] = useState("");
    let [searchValue2,setSearchValue2] = useState("");
    let [searchValue3,setSearchValue3] = useState("");

    function searchByUsername1(event){
        setSearchValue1(event.target.value);
    }

    function searchByUsername2(event){
        setSearchValue2(event.target.value);
    }

    function searchByUsername3(event){
        setSearchValue3(event.target.value);
    }

    function getFollowersRequestByUsername(){
        if(currUser!==null){
            let arr = currUser.followersRequests.filter((user)=>{
                 if(user.username.includes(searchValue1)){
                     return user;
                 }
            })
            return arr;
         }
    }

    function getFollowersByUsername(){
        if(currUser!==null){
           let arr = currUser.followers.filter((user)=>{
                if(user.username.includes(searchValue2)){
                    return user;
                }
           })
           return arr;
        }
    }

    function getFollowingsByUsername(){
        if(currUser!==null){
           let arr = currUser.following.filter((user)=>{
                if(user.username.includes(searchValue3)){
                    return user;
                }
           })
           return arr;
        }
    }

    useEffect(()=>{
        getFollowersRequestByUsername()
    },[searchValue1]);

    useEffect(()=>{
        getFollowersByUsername();
    },[searchValue2]);

    useEffect(()=>{
        getFollowingsByUsername();
    },[searchValue3]);

    return (
        <div id={styles.discoverPageMainContainer}>
            <h1>Follow Requests</h1>
            <SearchBox searchByUsername={searchByUsername1} searchValue={searchValue1} />
            <div id={styles.discoverPageCardContainer}>
                {currUser!==null && getFollowersRequestByUsername().length === 0 && <p>No Follow requests</p>}
                {currUser!==null && getFollowersRequestByUsername().map((followerRequestUser,indx)=>{
                    return (<ConnectionCard key={indx} currUserId={currUser._id} followerRequestUser={followerRequestUser} flag={true} isFollwingCard={false}/>);
                })}
            </div>
            <br />
            <br />
            <h1>Followers</h1>
            <SearchBox searchByUsername={searchByUsername2} searchValue={searchValue2} />
            <div id={styles.discoverPageCardContainer}>
            {currUser!==null && getFollowersByUsername().length === 0 && <p>No Followers</p>}
                {currUser!==null && getFollowersByUsername().map((followerRequestUser,indx)=>{
                    return (<ConnectionCard key={indx} currUserId={currUser._id} followerRequestUser={followerRequestUser} flag={false} isFollwingCard={false}/>);
                })}
            </div>
            <br />
            <br />
            <h1>Followings</h1>
            <SearchBox searchByUsername={searchByUsername3} searchValue={searchValue3} />
            <div id={styles.discoverPageCardContainer}>
            {currUser!==null && getFollowingsByUsername().length === 0 && <p>No Followers</p>}
                {currUser!==null && getFollowingsByUsername().map((followerRequestUser,indx)=>{
                    return (<ConnectionCard key={indx} currUserId={currUser._id} followerRequestUser={followerRequestUser} flag={false} isFollwingCard={true}/>);
                })}
            </div>
            <br />
            <br />
        </div>
    );
}

export default MyConnectionsPage;