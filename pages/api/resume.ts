import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

const getResume = async (req: NextApiRequest, res: NextApiResponse) => {
    const filePath = path.resolve(process.cwd(), "files/ayush_resume.pdf");
    const fileBuffer = fs.readFileSync(filePath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="ayush_resume.pdf"');
    res.send(fileBuffer);
};

export default getResume;
