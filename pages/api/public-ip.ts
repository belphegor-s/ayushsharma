import { NextApiRequest, NextApiResponse } from "next";
import requestIp from "request-ip";

const publicIP = (req: NextApiRequest, res: NextApiResponse) => {
    let success = false, msg = '';
    const ipAddress = requestIp.getClientIp(req);

    if(ipAddress) {
        res.status(200).json({success: true, msg: 'Your Public IP', ip: ipAddress});
    } else {
        res.status(404).json({success, msg: "Couldn't get the Public IP"});
    }
}

export default publicIP;