import { useEffect, useState } from "react";
import styles from "./SigninPage.module.css";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";

function SigninPage() {
    const api = axiosInstance();
    const navigate = useNavigate();
    let [isLoginPage, setIsLoginPage] = useState(true);
    let [isLoading,setIsLoading] = useState(false);
    let [formData,setFormData] = useState({username:"",name:"",email:"",password:""})
    function toggleLogin(){
        setIsLoginPage(!isLoginPage);
    }

    function handleInput(event){
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        setFormData((currFormData)=>{
            return {...currFormData,[fieldName]:fieldValue};
        })
    }

    async function handleFormSubmit(event){
        event.preventDefault();
        setIsLoading(true);
        if(isLoginPage){
            if(formData.username.includes(" ")){
                alert("Spaces are not allowed in username!");
            }else{
                const finalFormData = {email:formData.email,password:formData.password};
                const response = await api.post("/user/signin",finalFormData);
                if(response.data.success){
                    alert(response.data.success);
                    navigate(`/`);
                }else{
                    alert(response.data.error);
                }
                setFormData({username:"",name:"",email:"",password:""})
            }
        }else{
            if(formData.username.includes(" ")){
                alert("Spaces are not allowed in username!");
            }else{
                const finalFormData = formData;
                const response = await api.post("/user/signup",finalFormData);
                if(response.data.success){
                    alert(response.data.success);
                    navigate(`/`);
                }else{
                    alert("Error Occured While Setting Up Your Account! Please Try Again");
                }
                setFormData({username:"",name:"",email:"",password:""})
            }
        }
        setIsLoading(false);
    }

    return (
        <div id={styles.signinPageMainContainer}>
            <div id={styles.signinPageContainer}>
                <div id={styles.signinPageLeftContainer}>
                    <img src="/loginSideImg.avif" alt="login img" />
                </div>
                <form id={styles.signinPageRightContainer}>
                    <p id={styles.signinPageRightContainerHeading}>{isLoginPage ? "Student Login" : "Student Signup"}</p>
                    {!isLoginPage && (<> <div className={styles.formControl}>
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" value={formData.username} onChange={handleInput} required/>
                    </div>
                        <div className={styles.formControl}>
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" value={formData.name} onChange={handleInput} required/>
                        </div></>)}
                    <div className={styles.formControl}>
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInput} required/>
                    </div>
                    <div className={styles.formControl}>
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleInput} required/>
                    </div>
                    {isLoading ?  <button type="button" id={styles.loginBtn}>Loading...</button> : <button onClick={handleFormSubmit} id={styles.loginBtn}>{isLoginPage ? "LOGIN":"SIGN UP"}</button>}
                    <p onClick={toggleLogin} id={styles.signupBtn}>{isLoginPage ? "Create new account SIGN UP":"Open your existing account LOGIN"}</p>
                </form>
            </div>
        </div>
    );
}

export default SigninPage;