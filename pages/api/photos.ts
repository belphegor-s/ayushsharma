import { NextApiRequest, NextApiResponse } from "next";
import photos from "../../data/photos.json";

const getPhotos = async (req: NextApiRequest, res: NextApiResponse) => {
    let success = true, msg = 'Successfully fetched photos'
    res.status(200).json({success, msg, data: photos});
}

export default getPhotos;