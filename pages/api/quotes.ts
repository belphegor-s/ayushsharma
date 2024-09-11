import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

const getQuotes = async (req: NextApiRequest, res: NextApiResponse) => {
    let success = true,
        msg = "Successfully fetched quotes";

    const quotesData = await fs.readFile(path.join(process.cwd(), "data/quotes.json"), "utf8");
    const QUOTES = JSON.parse(quotesData || "{}");

    res.status(200).json({ success, msg, data: QUOTES.quotes });
};

export default getQuotes;
