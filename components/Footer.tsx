import Image from "next/image";
import styles from "../styles/Footer.module.scss";

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles["tech-stack"]}>
                <div>
                    Built with&nbsp;&nbsp;
                    <Image src="/img/nextjs.svg" alt="nextjs" width={18} height={18} />
                </div>
                <div>•</div>
                <div>
                    Deployed on&nbsp;&nbsp;
                    <Image src="/img/vercel.svg" alt="vercel" width={18} height={18} />
                </div>
            </div>
            <div className={styles.email}>
                <a href="mailto:howdy@ayushsharma.me">howdy@ayushsharma.me</a>
            </div>
        </footer>
    );
};

export default Footer;
