import styles from "../pages/ProfilePage.module.css";
function ProjectCard({project,viewProject,removeProject,isOwner}) {
    return (
        <div className={styles.projectCard}>          
            <img className={styles.projectImg} src={project.thumbanail.url} alt="project img" />
            <p className={styles.projectHeading}>{project.name}</p>
            <p className={styles.projectDescription}>{project.description.length > 50 ? project.description.slice(0,50)+"...":project.description}</p>
            <button className={styles.projectViewBtn} onClick={()=>{viewProject(project._id)}}>View</button>
            {isOwner && <i className="fa-solid fa-trash" style={{color: "#dc1e1e",cursor:"pointer"}} onClick={()=>{removeProject(project._id)}}></i> }
        </div>
    );
}

export default ProjectCard;