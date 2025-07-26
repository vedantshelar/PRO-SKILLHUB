import styles from "../pages/AllPosts.module.css";

function CommentBox({comment}) {
    return ( 
        <div className={styles.commentBox}>
        <p className={styles.commentBoxName}>{comment.owner.name}</p>
        <p className={styles.commentBoxUserName}>{comment.owner.username}</p>
        <p className={styles.commentBoxMessage}>{comment.content}</p>
    </div>
     );
}

export default CommentBox;