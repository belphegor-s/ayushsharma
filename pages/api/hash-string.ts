import { hashString } from "@/util/hashing";
import { NextApiRequest, NextApiResponse } from "next";

const hashedstring = async (req: NextApiRequest, res: NextApiResponse) => {
    let success = false, msg = '';

    const str = (req.body?.str && typeof req.body?.str === 'string' && req.body?.str.trim() !== '' && req.body?.str) || '';

    if(!str) {
        msg = 'Invalid Input'
        res.status(500).json({success, msg})
    }

    try {
        msg = 'Successfully hashed string'
        return res.status(200).json({success: true, msg, hashedString: hashString(str)})
    } catch(e) {
        msg = 'Error hashing the string'
        return res.status(200).json({success, msg})
    }
}

export default hashedstring;