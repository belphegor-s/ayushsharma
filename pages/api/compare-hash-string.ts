import { verifyString } from "@/util/hashing";
import { NextApiRequest, NextApiResponse } from "next";

const compareHashedString = async (req: NextApiRequest, res: NextApiResponse) => {
    let success = false, msg = '';

    const str = (req.body?.str && typeof req.body?.str === 'string' && req.body?.str.trim() !== '' && req.body?.str) || '',
    hashedStr = (req.body?.hashedStr && typeof req.body?.hashedStr === 'string' && req.body?.hashedStr.trim() !== '' && req.body?.hashedStr) || '';

    if(!str || !hashedStr) {
        msg = 'Invalid Input'
        res.status(500).json({success, msg})
    }

    try {
        msg = 'Successfully verified string'
        return res.status(200).json({success: true, msg, isEqual: verifyString(str, hashedStr)})
    } catch(e) {
        msg = 'Error verifying string'
        return res.status(200).json({success, msg})
    }
}

export default compareHashedString;