import convertDataToObject from "@/util/convertDataToObj";
import { NextApiRequest, NextApiResponse } from "next";

const myIP = async (req: NextApiRequest, res: NextApiResponse) => {
    let success = false,
        msg = "";

    try {
        msg = "Successfully fetched user's IP";
        const response = await fetch("https://ayushsharma.me/cdn-cgi/trace");

        if (response && response.status === 200) {
            const responseData = await response.text();
            const responseDataObj = convertDataToObject(responseData || "");
            return res.status(200).json({ success: true, msg, ...responseDataObj });
        } else {
            msg = "Error getting user's IP";
            return res.status(500).json({ success, msg });
        }
    } catch (e) {
        msg = "Error getting user's IP";
        return res.status(200).json({ success, msg });
    }
};

export default myIP;
