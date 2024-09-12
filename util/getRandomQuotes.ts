import { quotes } from "../data/quotes.json";

export default function getRandomQuotes() {
    return quotes
        .map((_) => _)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
}
