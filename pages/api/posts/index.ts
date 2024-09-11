import { NextApiRequest, NextApiResponse } from "next";
import posts from "../../../data/posts.json";

const getPosts = async (req: NextApiRequest, res: NextApiResponse) => {
    let success = true, msg = 'Successfully fetched posts'
    res.status(200).json({success, msg, data: posts});
}

export default getPosts;