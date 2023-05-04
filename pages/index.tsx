import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { BsGithub, BsLinkedin, BsTwitter, BsCaretDownFill } from "react-icons/bs";
import { IoMail } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import QUOTES from "../data/quotes.json";
import PROJECTS from "../data/projects.json";
import randomArrayItem from "@/util/getRandomArrItem";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Home() {
  const mainDivRef = useRef<HTMLDivElement | null>(null);
  const [randomQuote, setRandomQuote] = useState<{[key:string] :any}>();
  
  useEffect(() => {
    setRandomQuote(randomArrayItem(QUOTES.quotes));
  }, []);

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
          <a href="mailto:howdy@ayushsharma.me">
            <IoMail />
          </a>
        </div>
        <div className={styles['down-arrow']} onClick={() => mainDivRef.current?.scrollIntoView({behavior: 'smooth'})}>
          <BsCaretDownFill/>
        </div>
      </div>

      <div className={styles.main} ref={mainDivRef}>
        <div className={styles.quote}>
          <div>{randomQuote?.quote}</div>
          <div><i>~ {randomQuote?.author}</i></div>
        </div>
        <div className={styles.projects}>
          <h2>Projects</h2>
          <div className={styles['project-cards-wrap']}>
            {PROJECTS.map((project, i : number) =>
              <Link key={`project-${i}`} href={project.link} target="_blank" rel="noreferrer">
                <ProjectCard  data={project}/>
              </Link>
            )}
          </div>
        </div>
      </div>

      <Footer/>
    </>
  );
}
