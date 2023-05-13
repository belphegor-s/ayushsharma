import { NextApiRequest, NextApiResponse } from "next";

const publicIP = async (req: NextApiRequest, res: NextApiResponse) => {
    let success = false, msg = '';

    try {
        const response = await fetch(`https://geolocation-db.com/json/${process.env.GEO_LOCATION_API_KEY}`)

        if(response.ok && response.status === 200) {
            const data = await response.json();
            res.status(200).json({success: true, msg: 'IP Details fetched successfully', ...data})
        } else {
            res.status(404).json({success, msg: "Couldn't get the Public IP"})
        }
    } catch(e) {
        console.log(`Error fetching IP Details -> ${e}`);
    }
}

export default publicIP;