import styles from "@/styles/quote.module.scss";
import Typewriter from "typewriter-effect";

interface QuoteProps {
    quotes: string[];
}

const Quote = ({ quotes }: QuoteProps) => {
    return (
        <div className={styles.quote}>
            <Typewriter
                options={{
                    autoStart: true,
                    loop: true,
                    strings: quotes,
                    delay: 20,
                }}
            />
        </div>
    );
};
export default Quote;
