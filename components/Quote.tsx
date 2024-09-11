import styles from "@/styles/quote.module.scss";
import Typewriter from "typewriter-effect";
import QUOTES from "@/data/quotes.json";

const Quote = () => {
    const quotes = QUOTES.quotes.map(_ => _.quote);

    return (
        <div className={styles.quote}>
            <Typewriter
                options={{
                    autoStart: true,
                    loop: true,
                    strings: quotes,
                    delay: 20
                }}
            />
        </div>
    )
}
export default Quote