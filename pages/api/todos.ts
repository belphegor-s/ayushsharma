import { NextApiRequest, NextApiResponse } from "next";
import todos from "../../data/todos.json";

const getTodos = async (req: NextApiRequest, res: NextApiResponse) => {
    let success = true, msg = 'Successfully fetched todos'
    res.status(200).json({success, msg, data: todos});
}

export default getTodos;