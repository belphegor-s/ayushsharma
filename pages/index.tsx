import Head from "next/head";
import styles from "../styles/Home.module.scss";

export default function Home() {
  return (
    <>
      <Head>
        <title>Ayush Sharma</title>
        <meta name="description" content="Official App for the Domain" />
      </Head>
      <div className={styles.hero}>
        <h1>Ayush Sharma</h1>
        <div>Full Stack Web Developer</div>
      </div>
    </>
  );
}
