import { useNavigate, useParams } from "react-router-dom";
import styles from "../pages/ProfilePage.module.css";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
function SingleProjectCard() {
    const axios = axiosInstance();
    const [project,setProject] = useState(null);
    const [user,setUser] = useState(null);
    const navigate = useNavigate();
    const params = useParams();
    function getProjectById(user){
        const project = user.projects.filter((project)=>{
            if(project._id==params.projectId){
                return true;
            }else{
                return false;
            }
        })
        setProject(project[0]);
    }
    async function getProfileUser(userId) {
        const res = await axios.get(`/user/${userId}/profile`);
        if(res.data.user){
            setUser(res.data.user);
            getProjectById(res.data.user);
        }
    }

    useEffect(()=>{
        getProfileUser(params.userId);
    },[]);

    if(user===null && project===null){
        return (<h1>Loading...</h1>);
    }else{
        return (
            <div className={styles.singleProjectCard}>
                <img className={styles.singleProjectImg} src={project.thumbanail.url} alt="project img" />
                <p className={styles.singProjectHeading}>{project.name}</p>
                <p className={styles.singleProjectDescription}>{project.description}</p>
                <div className={styles.projectImgsContainer}>
                    {project.projectImgs.map((p,i)=>{
                        return (
                            <a href={p.url} target="_blank">Image{i+1}</a>
                        )
                    })}
                </div>
                <button className={styles.singProjectViewBtn} onClick={()=>{navigate(-1)}}>Back</button>
            </div>
        );
    }
}
export default SingleProjectCard;