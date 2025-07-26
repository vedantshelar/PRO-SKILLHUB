import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import DiscoverCard from "../Components/DiscoverCard";
import SearchBox from "../Components/SearchBox";
import styles from "./DiscoverPage.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function DiscoverPage() {
    const currUser = useSelector((store) => {
        return store.userState.user;
    })
    const navigate = useNavigate();
    const axios = axiosInstance();
    const [users, setUsers] = useState([]);
    let [searchValue, setSearchValue] = useState("");

    async function getAllUsers() {
        const res = await axios.get(`/user/all`);
        if (res.data.users) {
            setUsers(res.data.users);
            getUsersByUsername(res.data.users);
        }
    }

    function viewUser(userId) {
        navigate(`/profile/${userId}`);
    }

    function handleInput(e) {
        setSearchValue(e.target.value);
    }

    function getUsersByUsername(users) {
        if (users) {
            let arr = users.filter((user) => {
                return user.username.includes(searchValue);
            })
            return arr;
        }
        return [];
    }


    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        getUsersByUsername(users);
    }, [searchValue]);

    return (
        <div id={styles.discoverPageMainContainer}>
            <h1>Discover</h1>
            <SearchBox searchByUsername={handleInput} searchValue={searchValue} />
            <div id={styles.discoverPageCardContainer} >
                {getUsersByUsername(users).map((user, indx) => {
                    return (
                        currUser !== null ? currUser._id !== user._id ? <DiscoverCard viewUser={viewUser} user={user} key={indx} /> : null : <DiscoverCard viewUser={viewUser} user={user} key={indx} />
                    );
                })}
            </div>
        </div>
    );
}

export default DiscoverPage;