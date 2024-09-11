import { NextApiRequest, NextApiResponse } from "next";
import albums from "../../data/albums.json";

const getAlbums = async (req: NextApiRequest, res: NextApiResponse) => {
    let success = true, msg = 'Successfully fetched albums'
    res.status(200).json({success, msg, data: albums});
}

export default getAlbums;