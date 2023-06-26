import convertDataToObject from "@/util/convertDataToObj";
import { useEffect, useState } from "react";

interface obj {
    [key: string]: string;
}

const MyIp = () => {
    const [data, setData] = useState<obj>({});

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('/cdn-cgi/trace');

                if(response && response.status === 200) {
                    const responseData = await response.text();
                    const responseDataObj = convertDataToObject(responseData || '');
                    setData(responseDataObj || {});
                }
            } catch(e) {
                console.log(`Error making request -> ${e}`);
            }
        })()
    },[]);

    return (
        <div>{JSON.stringify(data, null, 2)}</div>
    )
}
export default MyIp