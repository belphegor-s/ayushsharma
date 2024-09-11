import styles from "../styles/ProjectCard.module.scss";

interface Props {
    data: { [key: string]: string };
}

const ProjectCard = ({ data }: Props) => {
    return (
        <div className={styles["project-card"]}>
            <h3>{data.header}</h3>
            <div>
                {data.body.split("|").map((para, i: number) => (
                    <p key={`project-body-para-${i}`}>{para}</p>
                ))}
            </div>
        </div>
    );
};

export default ProjectCard;
