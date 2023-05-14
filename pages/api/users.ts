import { NextApiRequest, NextApiResponse } from "next";
import users from "../../data/users.json";

const getUsers = async (req: NextApiRequest, res: NextApiResponse) => {
    let success = true, msg = 'Successfully fetched users'
    res.status(200).json({success, msg, data: users});
}

export default getUsers;