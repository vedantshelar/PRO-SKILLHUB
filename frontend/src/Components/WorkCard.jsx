import styles from "../pages/ProfilePage.module.css";

function WorkCard({work,removeWork,isOwner}) { 
    return (
        <div className={styles.workInfoCard}>
            <p className={styles.companyName}>{work.name}</p>
            <p className={styles.position}>Description-{work.position}</p>
            <p className={styles.experience}>Experience-{work.experience}</p>
            {isOwner && <i className="fa-solid fa-trash" style={{color: "#dc1e1e",cursor:"pointer"}} onClick={()=>{removeWork(work._id)}}></i> }
        </div>
    );
}

export default WorkCard;
