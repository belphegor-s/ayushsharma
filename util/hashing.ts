import { hashSync, compareSync } from "bcryptjs";

const hashString = (inputString : string) => {
    return hashSync(inputString, 12);
}

const verifyString = (inputString: string, hashedString: string) => {
    const isValid = compareSync(inputString, hashedString);
    return isValid;
}

export { hashString, verifyString };