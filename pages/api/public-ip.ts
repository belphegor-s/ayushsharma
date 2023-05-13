import { NextApiRequest, NextApiResponse } from "next";

const publicIP = (req: NextApiRequest, res: NextApiResponse) => {
    let success = false, msg = '';
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if(ipAddress) {
        res.status(200).json({success: true, msg: 'Your Public IP', ip: ipAddress})
    } else {
        res.status(404).json({success, msg: "Couldn't get the Public IP"})
    }
}

export default publicIP;