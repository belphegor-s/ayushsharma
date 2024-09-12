import { quotes } from "../data/quotes";

export default function getRandomQuotes() {
    return quotes.quotes
        .map((_) => _)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
}
