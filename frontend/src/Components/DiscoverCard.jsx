import styles from "../pages/DiscoverPage.module.css";

function DiscoverCard({user,viewUser}) {
    return (
        <div className={styles.discoverCard} onClick={()=>{viewUser(user._id)}}>
            <img className={styles.discoverCardImg} src={user.profilePic} alt="profile img" />
            <div className={styles.discoverCardInfoSection}>
                <p className={styles.discoverCardName}>{user.name}</p>
                <p className={styles.discoverCardUsername}>{user.username}</p>
            </div>
        </div>
    );
}

export default DiscoverCard;