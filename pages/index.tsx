import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { BsGithub, BsLinkedin, BsTwitter } from "react-icons/bs";

export default function Home() {
  return (
    <>
      <Head>
        <title>Ayush Sharma</title>
        <meta name="description" content="Official App for the Domain" />
      </Head>

      <div className={styles.hero}>
        <h1>Ayush Sharma</h1>
        <div className={styles.subheading}>Full Stack Web Developer</div>
        <div className={styles.profiles}>
          <a
            href="https://github.com/belphegor-s"
            target="_blank"
            rel="noreferrer"
          >
            <BsGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/ayush-sharma-2802/"
            target="_blank"
            rel="noreferrer"
          >
            <BsLinkedin />
          </a>
          <a
            href="https://twitter.com/sharma_0502"
            target="_blank"
            rel="noreferrer"
          >
            <BsTwitter />
          </a>
        </div>
      </div>
    </>
  );
}
