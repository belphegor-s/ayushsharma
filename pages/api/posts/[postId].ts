import { NextApiRequest, NextApiResponse } from "next";
import posts from "../../../data/posts.json";

const getPosts = async (req: NextApiRequest, res: NextApiResponse) => {
    const postId = (req.query && req.query?.postId && !isNaN(req.query?.postId as any) && !isNaN(parseFloat(req.query?.postId as string)) && req.query?.postId) || '';

    if(!postId || (+postId > 100) || (+postId < 1)) {
        return res.status(500).json({success: false, msg: "Post ID is invalid or doesn't exists (Posts range -> 1 to 100)"})
    }

    res.status(200).json({success: true, msg: 'Successfully fetched post with matched ID', data: posts[parseInt(postId as string) - 1]});
}

export default getPosts;