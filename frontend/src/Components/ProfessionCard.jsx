import styles from "../pages/ProfilePage.module.css";
function ProfesstionCard({profession,removeProfession,isOwner}) {
    return (
        <div className={styles.workInfoCard}>
            <p className={styles.companyName}>{profession}</p>
            {isOwner && <i className="fa-solid fa-trash" style={{color: "#dc1e1e",cursor:"pointer"}} onClick={removeProfession}></i>}
        </div>
    );
}

export default ProfesstionCard;