import { NextApiRequest, NextApiResponse } from "next";

const publicIP = async (req: NextApiRequest, res: NextApiResponse) => {
    let success = false, msg = '';

    try {
        const response = await fetch(`https://geolocation-db.com/json/${process.env.GEO_LOCATION_API_KEY}`)

        if(response.ok && response.status === 200) {
            const data = await response.json();
            msg = 'IP Details fetched successfully';
            res.status(200).json({success: true, msg, ...data})
        } else {
            msg = "Couldn't get the Public IP";
            res.status(404).json({success, msg})
        }
    } catch(e) {
        console.log(`Error fetching IP Details -> ${e}`);
    }
}

export default publicIP;