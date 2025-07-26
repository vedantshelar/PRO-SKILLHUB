import { NavLink, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import axiosInstance from "../axiosInstance";
import { useSelector } from "react-redux";

function Navbar() {
    const userState = useSelector((store)=>{
        return store.userState;
    })
    const api = axiosInstance();
    let navigate = useNavigate();
    async function handleLogout(){
        const response = await api.get("/user/logout");
        if(response.data.success){
            alert(response.data.success)
            navigate(`/signin`);
        }else{
            alert(response.data.console.error)
        }
    }

    return (
        <div id={styles.navbarMainContainer}>
            <div id={styles.navbarLeftContainer}>
            <i className="fa-solid fa-graduation-cap"></i>
                <p id={styles.appLogo}><span>Skill</span>Hub</p>
            </div>
            <div id={styles.navbarRightContainer}>
                {userState.user!==null && <NavLink to={`/profile/${userState.user._id}`} className={styles.navItem}>Profile</NavLink>}
                {userState.user!==null ? <NavLink onClick={handleLogout} className={styles.navItem}>Logout</NavLink> : <NavLink to={'/signin'} className={styles.navItem}>Login</NavLink>}
            </div>
        </div>
    );
}

export default Navbar;