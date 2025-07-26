import styles from "./AppBar.module.css";
import { NavLink } from "react-router-dom";

function AppBar() {
    return (
        <div id={styles.appBarMainContainer}>
            <NavLink to={"/"} className={styles.navLinkItem}><i class="fa-solid fa-house"></i>
            </NavLink>
            <NavLink to={"/discover"} className={styles.navLinkItem}><i class="fa-solid fa-magnifying-glass"></i>
            </NavLink>
            <NavLink to={"/myConnection"} className={styles.navLinkItem}><i class="fa-solid fa-user"></i>
            </NavLink>
        </div>
    );
}

export default AppBar;