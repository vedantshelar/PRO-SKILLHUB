import styles from "../pages/DiscoverPage.module.css";

function SearchBox({ searchByUsername, searchValue }) {
    return (<input type="text" id={styles.discoverSearchBox} placeholder="search by username" onChange={searchByUsername} value={searchValue} />);
}

export default SearchBox;