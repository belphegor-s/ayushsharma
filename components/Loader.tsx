import styles from "@/styles/Loader.module.scss";

const Loader = () => {
    return (
        <div className={styles.loader}>
            <div className={styles["primary-loading"]}></div>
        </div>
    );
};

export default Loader;
