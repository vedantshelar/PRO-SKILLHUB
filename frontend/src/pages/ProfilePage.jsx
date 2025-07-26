import { useEffect, useRef, useState } from "react";
import ProfesstionCard from "../Components/ProfessionCard";
import ProjectCard from "../Components/ProjectCard";
import WorkCard from "../Components/WorkCard";
import styles from "./ProfilePage.module.css";
import { useSelector, useDispatch } from "react-redux";
import axiosInstance from "../axiosInstance";
import { fetchUser } from "../../slices/userSlice";
import { useNavigate, useParams } from "react-router-dom";

function ProfilePage() {
    const currUser = useSelector((store) => {
        return store.userState.user;
    })
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const { userId } = useParams();
    const api = axiosInstance();
    const dispatch = useDispatch();
    let profilePic = useRef(null);
    let profileBgImg = useRef(null)
    let projectImagesContainer = useRef(null);
    let [uploading, setUploading] = useState(false);
    let [sendingFollowRequest, setSendingFollowRequest] = useState(false);
    let [showUploadBtn, setShowUploadBtn] = useState(false);
    let [isProjectDeleting,setIsProjectDeleting] = useState(false);
    let [professionModal, setProfessionModal] = useState(false);
    let [workModal, setworkModal] = useState(false);
    let [projectModal, setProjectModal] = useState(false);
    let [professionModalForm, setProfessionModalForm] = useState({ profession: "" })
    let [workModalForm, setWorkModalForm] = useState({ name: "", position: "", experience: "" })
    let [projectModalForm, setProjectModalForm] = useState({ name: "", description: "", thumbanail: "/defaultProjectthumbanail.jpg", images: "" })
    let [name, setName] = useState(null);
    let [bio, setBio] = useState(null);

    function toggleProfessionModal(flag) {
        if (flag) {
            setProfessionModal(true);
        } else {
            setProfessionModal(false);
        }
    }

    function toggleWorkModalModal(flag) {
        if (flag) {
            setworkModal(true);
        } else {
            setworkModal(false);
        }
    }

    function toggleProjectModal(flag) {
        if (flag) {
            setProjectModal(true);
        } else {
            setProjectModalForm({ name: "", description: "", thumbanail: "/defaultProjectthumbanail.jpg", images: "" });
            setProjectModal(false);
        }
    }

    async function updateUserProfilePic(event) {
        event.stopPropagation();
        const file = profilePic.current.files[0];
        const formData = new FormData();
        formData.append("profilePic", file);
        setUploading(true);
        const res = await api.post(`/user/${user._id}/upload-profilePic`, formData);
        if (res.data.success) {
            alert(res.data.success);
            dispatch(fetchUser());
            getCurrUser(userId);
        } else {
            alert(res.data.error);
        }
        setUploading(false);
    }
    async function updateUserProfileBgImg() {
        const file = profileBgImg.current.files[0];
        const formData = new FormData();
        formData.append("profileBgImg", file);
        setUploading(true);
        const res = await api.post(`/user/${user._id}/upload-profileBgImg`, formData);
        if (res.data.success) {
            alert(res.data.success);
            dispatch(fetchUser());
            getCurrUser(userId);
        } else {
            alert(res.data.error);
        }
        setUploading(false);
    }

    function handleUploadBtn() {
        if (name !== null && bio !== null) {
            if (name !== user.name || bio !== user.bio) {
                setShowUploadBtn(true);
            } else {
                setShowUploadBtn(false);
            }
        }
    }

    async function updateNameOrBio() {
        if (name !== null && bio !== null) {
            if (name.length !== 0 && bio.length !== 0) {
                setUploading(true);
                const res = await api.put(`/user/${user._id}/nameBio`, { name, bio });
                if (res.data.success) {
                    alert(res.data.success)
                } else {
                    alert(res.data.error);
                }
                setUploading(false);
                setShowUploadBtn(false);
                dispatch(fetchUser());
                getCurrUser(userId);
            }
        }
    }

    function handleProfessionModalForm(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        setProfessionModalForm((currProfessionModalForm) => {
            return { ...currProfessionModalForm, [fieldName]: fieldValue };
        })
    }

    async function addProfession() {
        if (professionModalForm.profession.length !== 0) {
            const res = await api.post(`/user/${user._id}/professions`, { profession: professionModalForm.profession });
            if (res.data.success) {
                //profession added!
            } else {
                alert("Please try again!");
            }
            setProfessionModalForm({ profession: "" });
            dispatch(fetchUser());
            getCurrUser(userId);
            toggleProfessionModal(false);
        } else {
            alert("Please provide some profession!");
        }
    }

    async function removeProfession(event) {
        const profession = event.target.parentElement.querySelector("P").textContent;
        const res = await api.delete(`/user/${user._id}/professions`, {
            data: { profession: profession }
        });
        if (res.data.success) {
            //profession removed!
        } else {
            alert("Please try again!");
        }
        getCurrUser(userId);
    }

    function handleWorkModalForm(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        setWorkModalForm((currWorkModalForm) => {
            return { ...currWorkModalForm, [fieldName]: fieldValue };
        })
    }

    async function addWork() {
        // alert("working")
        if (workModalForm.name.length !== 0 && workModalForm.position.length !== 0) {
            const res = await api.post(`/user/${user._id}/works`, { name: workModalForm.name, position: workModalForm.position, experience: workModalForm.experience });
            if (res.data.success) {
                // work added!
            } else {
                alert("Please try again!");
            }
            setWorkModalForm({ name: "", position: "", experience: "" });
            dispatch(fetchUser());
            getCurrUser(userId);
            toggleWorkModalModal(false);
        } else {
            alert("Fields can not be kept empty!");
        }
    }

    async function removeWork(workId) {
        const res = await api.delete(`/user/${user._id}/works`, {
            data: { workId:workId }
          });
        if (res.data.success) {
            // work added!
        } else {
            alert("Please try again!");
        }
        getCurrUser(userId);
    }

    function handleProjectModalForm(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        setProjectModalForm((currProjectModalForm) => {
            return { ...currProjectModalForm, [fieldName]: fieldValue };
        })
    }

    function handleProjectThumbanail(event) {
        const fieldName = event.target.name;
        setProjectModalForm((currProjectModalForm) => {
            return { ...currProjectModalForm, [fieldName]: event.target.files[0] };
        })
    }

    function handleProjectImages(event) {
        const fieldName = event.target.name;
        const files = Array.from(event.target.files);
        setProjectModalForm((currProjectModalForm) => {
            return { ...currProjectModalForm, [fieldName]: files };
        })
    }

    async function addProject() {
        setUploading(true);
        const res = await api.post(`/user/${user._id}/project/data`, { name: projectModalForm.name, description: projectModalForm.description });
        if (res.data.projectId) {
            if (projectModalForm.thumbanail !== "/defaultProjectthumbanail.jpg") {
                const formData = new FormData();
                formData.append("thumbanail", projectModalForm.thumbanail);
                await api.post(`/user/${user._id}/${res.data.projectId}/uploadProjectThumbanail`, formData);
            }

            if (projectModal) {
                const children = projectImagesContainer.current.children;
                const formData = new FormData();
                if (Array.from(children).length !== 0) {
                    Array.from(children).forEach((child) => {
                        formData.append("images", child.querySelector("input").files[0]);
                    });
                    await api.post(`/user/${user._id}/${res.data.projectId}/uploadProjectImages`, formData);
                }
            }
            setUploading(false);
        } else {
            alert("Cloud not add project, please try it again!");
        }
        setProjectModalForm({ name: "", description: "", thumbanail: "/defaultProjectthumbanail.jpg", images: "" });
        setProjectModal(false);
        dispatch(fetchUser());
        getCurrUser(userId);
    }

    async function removeProject(projectId) {
        setIsProjectDeleting(true);
        const res = await api.delete(`/user/${user._id}/project/${projectId}`);
        if (res.data.success) {
            // work added!
        } else {
            alert("Please try again!");
        }
        getCurrUser(userId); 
        setIsProjectDeleting(false);
    }

    function addProjectImages() {
        let div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.innerHTML = `  <input type="file" name="images" accept="image/*" />
                            <span >x</span>`
        projectImagesContainer.current.append(div)
    }

    function handleProjectImgDelete(event) {
        if (event.target.tagName === "SPAN") {
            event.target.parentElement.remove()
        }
    }

    function navigateToSingleProjectPage(projectId) {
        navigate(`/${userId}/${projectId}/view`);
    }

    async function getCurrUser(userId) {
        const res = await api.get(`/user/${userId}/profile`);
        if (res.data.user) {
            setName(res.data.user.name);
            setBio(res.data.user.bio);
            setUser(res.data.user);
        }
    }

    function isCurrUserFollowing() {
        if (currUser !== null && user !== null) {
            return user.followers.includes(currUser._id);
        }
    }

    function isCurrUserSentFollowingRequest() {
        if (currUser !== null && user !== null) {
            return user.followersRequests.includes(currUser._id);
        }
    }

    async function sendFollowRequest() {
        setSendingFollowRequest(true);
        const res = await api.post(`/user/${currUser._id}/${user._id}/followRequest`);
        console.log(res.data);
        if (!res.data.success) {
            alert("Cloud not send follow request!");
        }
        setSendingFollowRequest(false);
        getCurrUser(userId);
    }

    useEffect(() => {
        getCurrUser(userId);
    }, [userId]);

    useEffect(() => {
        handleUploadBtn();
    }, [name, bio])

    useEffect(() => {
        if (projectImagesContainer.current !== null) {
            if (!projectModal) {
                const children = projectImagesContainer.current.children;
                Array.from(children).forEach((child) => {
                    child.remove();
                });
            }
        }
    }, [projectModal]);

    if (user === null) {
        return <h1>Loading...</h1>
    } else {
        return (
            <div id={styles.profileMainContainer}>
                {currUser !== null && user._id === currUser._id ? <button onClick={updateNameOrBio} className={styles.uploadBtn} style={{ display: showUploadBtn ? "block" : "none" }}>update</button> : null}
                {uploading && <span>uploading...</span>}
                <label htmlFor={userId === user._id ? "profileBgImg" : ""} id={styles.profileHeroContainer} style={{
                    backgroundImage: `url(${user.profileBgImg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
                    {currUser !== null && user._id === currUser._id ? (<><div id={styles.blackImg}></div>
                        <div id={styles.bgProfileBtn}>Edit</div></>) : null}
                    <label htmlFor={currUser !== null && user._id === currUser._id ? "profilePic" : ""} id={styles.profileImgContainer} onClick={(e) => { e.stopPropagation() }}>
                        <img id={styles.profileImg} src={user.profilePic} alt="profile image" />
                        {currUser !== null && user._id === currUser._id ? <span id={styles.editProfileImgBtn}>Edit</span> : null}
                    </label>
                </label>
                {currUser !== null && user._id === currUser._id ? (<>
                    <input onChange={updateUserProfilePic} ref={profilePic} type="file" name="profilePic" id="profilePic" style={{ display: "none" }} />
                    <input onChange={updateUserProfileBgImg} ref={profileBgImg} type="file" name="profileBgImg" id="profileBgImg" style={{ display: "none" }} />
                </>) : null}
                <div id={styles.profileInfoContainer}>
                    <div id={styles.profileUsernameAndBioContainer}>
                        <div id={styles.profileUsernameAndNameContainer}>
                            <div>
                                <input type="text" id={styles.name} value={name} onChange={(e) => { { currUser !== null && user._id === currUser._id ? setName(e.target.value) : null } }} />
                                <p id={styles.username}>{user.username}</p>
                            </div>
                            <div id={styles.followersContainer}>
                                <p>Followers({user.followers.length})</p>
                                <p>Following({user.following.length})</p>
                                {currUser !== null && currUser._id !== user._id ? isCurrUserFollowing() ? null : isCurrUserSentFollowingRequest() ? <button id={styles.followBtn} style={{ display: "block" }} >requested</button> : <button id={styles.followBtn} style={{ display: "block" }} onClick={sendFollowRequest}>{sendingFollowRequest ? "requesting..." : "Follow"}</button> : null}

                            </div>
                        </div>
                    </div>
                    <div id={styles.profileBioContainer}>
                        <textarea id={styles.bio} value={bio} onChange={(e) => { { currUser !== null && user._id === currUser._id ? setBio(e.target.value) : null } }}></textarea>
                    </div>
                    <div id={styles.profileWorkContainer}>
                        <p>Professions</p>
                        <div id={styles.workInfoCardContainer}>
                            {user.professions.length === 0 ? <span style={{ fontSize: "0.9rem" }}>not added yet</span> : user.professions.map((profession, indx) => {
                                return (<ProfesstionCard key={indx} profession={profession} removeProfession={removeProfession} isOwner={currUser !== null && currUser._id === user._id} />)
                            })}
                            {currUser !== null && user._id === currUser._id ? <button id={styles.addWorkBtn} onClick={() => { toggleProfessionModal(true) }}>Add Profession</button> : null}
                        </div>
                    </div>
                    <div id={styles.profileWorkContainer}>
                        <p>My Experiences</p>
                        <div id={styles.workInfoCardContainer}>
                            {user.works.length === 0 ? <span style={{ fontSize: "0.9rem" }}>not added yet</span> : user.works.map((work, indx) => {
                                return (<WorkCard key={indx} work={work} removeWork={removeWork} isOwner={currUser !== null && currUser._id === user._id}/>)
                            })}
                            {currUser !== null && user._id === currUser._id ? <button id={styles.addWorkBtn} onClick={() => { toggleWorkModalModal(true) }}>Add Work</button> : null}
                        </div>
                    </div>
                    <div id={styles.projectMainContainer}>
                        <p>My Projects</p>
                        {isProjectDeleting &&  <span>deleting...</span>}  
                        <div id={styles.projectContainer}>
                            {user.projects.length === 0 ? <span style={{ fontSize: "0.9rem" }}>not added yet</span> : user.projects.map((project, indx) => {
                                return (<ProjectCard key={indx} project={project} viewProject={() => { navigateToSingleProjectPage(project._id) }} removeProject={removeProject} isOwner={currUser !== null && currUser._id === user._id}/>);
                            })}
                            {currUser !== null && user._id === currUser._id ? <button id={styles.addWorkBtn} onClick={() => { toggleProjectModal(true) }}>Add Project</button> : null}
                        </div>
                    </div>
                </div>
                <div style={{ display: professionModal ? "flex" : "none" }} id={styles.modalMainContainer} onClick={() => { toggleProfessionModal(false) }}>
                    <form id={styles.modal} onClick={(e) => { e.stopPropagation(); }}>
                        <input type="text" name="profession" placeholder="Enter your profession here" value={professionModalForm.profession} onChange={handleProfessionModalForm} />
                        {currUser !== null && user._id === currUser._id ? <button type="button" onClick={addProfession}>Add Profession</button> : null}
                    </form>
                </div>
                <div style={{ display: workModal ? "flex" : "none" }} id={styles.modalMainContainer} onClick={() => { toggleWorkModalModal(false) }}>
                    <form id={styles.modal} onClick={(e) => { e.stopPropagation(); }}>
                        <input type="text" placeholder="Enter Title " name="name" value={workModalForm.name} onChange={handleWorkModalForm} />
                        <input type="text" placeholder="Enter Position : eg: web developer" name="position" value={workModalForm.position} onChange={handleWorkModalForm} />
                        <input type="number" placeholder="Enter Experience in months" name="experience" value={workModalForm.experience} onChange={handleWorkModalForm} />
                        {currUser !== null && user._id === currUser._id ? <button type="button" onClick={addWork}>Add Work</button> : null}
                    </form>
                </div>
                <div style={{ display: projectModal ? "flex" : "none" }} id={styles.modalMainContainer} onClick={() => { toggleProjectModal(false) }}>
                    <form id={styles.modal} onClick={(e) => { e.stopPropagation(); }}>
                        {uploading && <span>uploading...</span>}
                        <input type="text" placeholder="Enter Project Name" name="name" value={projectModalForm.name} onChange={handleProjectModalForm} />
                        <input type="text" placeholder="Enter Project Description" name="description" value={projectModalForm.description} onChange={handleProjectModalForm} />
                        <label htmlFor="thumbanail" style={{ backgroundColor: "lightgreen", width: "70%", padding: "5px", borderRadius: "5px", cursor: "pointer" }}>upload thumbanail</label>
                        <div ref={projectImagesContainer} style={{ display: "flex", flexDirection: "column", rowGap: "5px", paddingLeft: "5px" }} onClick={handleProjectImgDelete}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <input type="file" name="images" accept="image/*" />
                                <span>x</span>
                            </div>
                        </div>
                        <label htmlFor="pdf" style={{ backgroundColor: "lightgreen", width: "70%", padding: "5px", borderRadius: "5px", cursor: "pointer" }} onClick={addProjectImages}>add project images</label>
                        <input type="file" name="thumbanail" accept="image/*" id="thumbanail" style={{ display: "none" }} onChange={handleProjectThumbanail} />
                        {currUser !== null && user._id === currUser._id ? <button type="button" onClick={addProject}>Add Project</button> : null}
                    </form>
                </div>
            </div>
        );
    }
}

export default ProfilePage;