import { useEffect, useRef, useState } from "react";
import styles from "./ChatWindow.module.css";
import { useNavigate, useParams } from "react-router-dom";
import connectSocket from "../connectSocket";
import axiosInstance from "../axiosInstance";

function ChatWindow() {
    let socket = useRef(null);
    let bottomRef = useRef(null);
    let navigate = useNavigate();
    const params = useParams();
    let [message, setMessage] = useState("");
    let [messages, setMessages] = useState([]);

    function goToBack() {
        navigate(-1);
    }

    function sendMessage() {
        let senderId = params.senderId;
        let receiverId = params.receiverId;
        if (message.length !== 0) {
            socket.current.emit("send-message", { senderId, receiverId, message });
            getMessages();
            setMessage("");
        }
    }

    async function getMessages() {
        let senderId = params.senderId;
        let receiverId = params.receiverId;
        const axios = axiosInstance();
        const res = await axios.get(`/user/${senderId}/${receiverId}/chats`);
        if (res.data.messages) {
            setMessages(res.data.messages);
        }
    }

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        getMessages();
        socket.current = connectSocket();
        socket.current.emit("map", params.senderId);
        socket.current.on("receive-message", () => {
            getMessages();
        })
    }, [])
    return (
        <div id={styles.chatWindowMainContainer}>
            <div id={styles.userInfo}>
                <i onClick={goToBack} className="fa-solid fa-arrow-left-long"></i>
                <div id={styles.userNameContainer}>
                    <span className={styles.username}>{params.name}</span>
                    <span className={styles.online}>{params.username}</span>
                </div>
            </div>
            <div id={styles.chatsContainer}>
                <div id={styles.chats}>

                    {messages.map((msg, indx) => {
                        return (
                            msg.sender === params.senderId ? (
                                <div key={indx} className={styles.senderMessageContainer}>
                                    <span className={styles.senderMessage}>{msg.content}</span>
                                </div>
                            ) : (
                                <div key={indx} className={styles.receiverMessageContainer}>
                                    <span className={styles.receiverMessage}>{msg.content}</span>
                                </div>
                            )
                        )
                    })}
                    {/* 
                    <div className={styles.senderMessageContainer}>
                        <span className={styles.senderMessage}>hello vedant</span>
                    </div>
                    <div className={styles.receiverMessageContainer}>
                        <span className={styles.receiverMessage}>hello abhishek</span>
                    </div> */}

                    <div ref={bottomRef}></div>
                </div>
                <div id={styles.sendMessageContainer}>
                    <input type="text" name="message" placeholder="Type message here.." value={message} onChange={(e) => { setMessage(e.target.value) }} />
                    <i className="fa-solid fa-paper-plane" onClick={sendMessage}></i>
                </div>
            </div>
        </div>
    );
}

export default ChatWindow;