import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { BsGithub, BsLinkedin, BsTwitterX, BsCaretDownFill } from "react-icons/bs";
import { FiExternalLink } from "react-icons/fi";
import { useEffect, useRef, useState, Fragment } from "react";
import PROJECTS from "../data/projects.json";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";
import Footer from "@/components/Footer";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import Image from "next/image";
import getSocialHandles from "../public/globals/getSocialHandles";
import getOdin from "../public/globals/getOdinFunctions";
import getRandomId from "../public/globals/getRandomId";
import getRandomNum from "../public/globals/getRandomNum";
import getRandomUUID from "../public/globals/getRandomUUID";
import getRandomArr from "../public/globals/getRandomArr";
import webLinks from "@/data/webLinks.json";
import Quote from "@/components/Quote";
import Loader from "@/components/Loader";

const safeWindow: any = typeof window !== "undefined" ? window : {};

export default function Home() {
	const mainDivRef = useRef<HTMLDivElement | null>(null);
	const [showTopButton, setShowTopButton] = useState(false);
	const [hasMounted, setHasMounted] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const onScrollEventHandler = () => {
			if (window.scrollY >= window.innerHeight) {
				setShowTopButton(true);
			} else {
				setShowTopButton(false);
			}
		};

		window.addEventListener("scroll", onScrollEventHandler);

		return () => window.removeEventListener("scroll", onScrollEventHandler);
	}, []);

	useEffect(() => {
		safeWindow.getSocialHandles = getSocialHandles;
		safeWindow.odin = getOdin;
		safeWindow.getRandomId = getRandomId;
		safeWindow.getRandomNum = getRandomNum;
		safeWindow.getRandomUUID = getRandomUUID;
		safeWindow.getRandomArr = getRandomArr;
	}, []);

	useEffect(() => {
		if (!hasMounted) {
			setHasMounted(true);
		} else {
			console.log(
				"%cExplore global %cwindow%c object for hidden functions",
				"font-weight: bold; color: #1B9C85",
				"color: #ffffff; background: #4d455d; padding: .2em; border-radius: .2em",
				"font-weight: bold; color: #1B9C85"
			);
		}
	}, [hasMounted]);

	return (
		<>
			<Head>
				<title>Ayush Sharma</title>
				<meta name="description" content="Ayush's portfolio" />
			</Head>
			<div style={loading ? {} : { display: "none" }}>
				<Loader />
			</div>
			<div style={loading ? { display: "none" } : {}}>
				<div className={styles.hero}>
					<div className={styles["web-links"]}>
						{webLinks?.map((link: { [key: string]: any }, i: number) => {
							return (
								<Fragment key={`header-link-${i}`}>
									<a href={link?.link || ""} target="_blank" rel="noreferrer noopener">
										{link?.title || ""}
										<FiExternalLink />
									</a>
									{i !== webLinks?.length - 1 && <span className={styles["web-links-separator"]}>|</span>}
								</Fragment>
							);
						})}
					</div>
					<div className={styles["initials"]}>
						<Image src="/img/initials.svg" alt="ayush" width={400} height={100} priority onLoad={() => setLoading(false)} />
						<div className="pyramid-loader">
							<div className="wrapper">
								<span className="side side1"></span>
								<span className="side side2"></span>
								<span className="side side3"></span>
								<span className="side side4"></span>
								<span className="shadow"></span>
							</div>
						</div>
					</div>
					<div className={styles.subheading}>Developer / Tinkerer / Stoic</div>
					<div className={styles.profiles}>
						<a href="https://github.com/belphegor-s" target="_blank" rel="noreferrer">
							<BsGithub />
						</a>
						<a href="https://www.linkedin.com/in/ayush-sharma-2802/" target="_blank" rel="noreferrer">
							<BsLinkedin />
						</a>
						<a href="https://x.com/sharma_0502" target="_blank" rel="noreferrer">
							<BsTwitterX />
						</a>
					</div>
					<div className={styles["down-arrow"]} onClick={() => mainDivRef.current?.scrollIntoView({ behavior: "smooth" })}>
						<BsCaretDownFill size={15} />
					</div>
				</div>
				<div className={styles.main} ref={mainDivRef}>
					<Quote />
					<div className={styles.projects}>
						<h2>Projects</h2>
						<div className={styles["project-cards-wrap"]}>
							{PROJECTS.map((project, i: number) => (
								<Link key={`project-${i}`} href={project.link} target="_blank" rel="noreferrer">
									<ProjectCard data={project} />
								</Link>
							))}
						</div>
					</div>
				</div>
				{showTopButton && (
					<div className={styles["top-btn"]} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
						<BsFillArrowUpCircleFill />
					</div>
				)}
				<Footer />
			</div>
		</>
	);
}
