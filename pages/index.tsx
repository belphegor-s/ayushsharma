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
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import Image from "next/image";
import getSocialHandles  from "../public/globals/getSocialHandles";
import getOdin from "../public/globals/getOdinFunctions";
import getRandomId from "../public/globals/getRandomId";
import getRandomNum from "../public/globals/getRandomNum";
import getRandomUUID from "../public/globals/getRandomUUID";
import getRandomArr from "../public/globals/getRandomArr";

const safeWindow: any = typeof window !== "undefined" ? window : {};

export default function Home() {
  const mainDivRef = useRef<HTMLDivElement | null>(null);
  const [randomQuote, setRandomQuote] = useState<{[key:string] :any}>();
  const [showTopButton, setShowTopButton] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const developerImgRef = useRef<HTMLImageElement | null>(null);
  const developerTextRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setRandomQuote(randomArrayItem(QUOTES.quotes));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY >= window.innerHeight) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    });
  }, []);

  useEffect(() => {
    (safeWindow).getSocialHandles = getSocialHandles;
    (safeWindow).odin = getOdin;
    (safeWindow).getRandomId = getRandomId;
    (safeWindow).getRandomNum = getRandomNum;
    (safeWindow).getRandomUUID = getRandomUUID;
    (safeWindow).getRandomArr = getRandomArr;
  }, []);

  useEffect(() => {
    if(!hasMounted) {
      setHasMounted(true);
    } else {
      console.log("%cExplore global %cwindow%c object for hidden functions", "font-weight: bold; color: #1B9C85", "color: #ffffff; background: #4d455d; padding: .2em; border-radius: .2em", "font-weight: bold; color: #1B9C85")
    }
  }, [hasMounted])

  useEffect(() => {
    // developerTextRef.current?.addEventListener('mouseover', () => {
    //   if(developerImgRef.current) {
    //     developerImgRef.current.style.display = 'block'
    //   }
    // })

    // developerTextRef.current?.addEventListener('mouseout', () => {
    //   if(developerImgRef.current) {
    //     developerImgRef.current.style.display = 'none';
    //   }
    // });

    developerTextRef.current?.addEventListener('mousemove', (e: MouseEvent) => {
      let x = e.clientX;
      let y = e.clientY;
      if(developerImgRef.current) {
        developerImgRef.current.style.left = `${x}px`;
        developerImgRef.current.style.top = `${y}px`;
      }
    })
  }, [])

  return (
    <>
      <Head>
        <title>Ayush Sharma</title>
        <meta name="description" content="Official App for the Domain" />
      </Head>
      <div className={styles.hero}>
        <div className={styles['initials']}>
          <Image src="/img/initials.svg" alt="ayush" width={535} height={125} priority/>
        </div>
        <div className={styles.subheading} ref={developerTextRef}>Full Stack Web Developer</div>
        {/* <Image src="/img/developer.svg" alt="developer" width={175} height={175} className={styles['developer-img']} ref={developerImgRef} priority/> */}
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
          <a href="mailto:ayush2162002@gmail.com">
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
      {showTopButton && 
        <div className={styles['top-btn']} onClick={() => window.scrollTo({top: 0, behavior:'smooth'})}>
          <BsFillArrowUpCircleFill />
        </div>
      }
      <Footer/>
    </>
  );
}
