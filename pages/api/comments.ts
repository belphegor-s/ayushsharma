import { NextApiRequest, NextApiResponse } from "next";
import comments from "../../data/comments.json";

const getComments = async (req: NextApiRequest, res: NextApiResponse) => {
    let success = true, msg = 'Successfully fetched comments'
    res.status(200).json({success, msg, data: comments});
}

export default getComments;