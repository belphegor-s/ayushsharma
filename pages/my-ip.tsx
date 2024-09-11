import convertDataToObject from "@/util/convertDataToObj";
import syntaxHighlightJSON from "@/util/syntaxHighlightJSON";
import { useEffect, useState } from "react";

interface obj {
    [key: string]: string;
}

const MyIp = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<obj>({});

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch("https://ayushsharma.me/cdn-cgi/trace");

                if (response && response.status === 200) {
                    const responseData = await response.text();
                    const responseDataObj = convertDataToObject(responseData || "");
                    setData(responseDataObj || {});
                }
            } catch (e) {
                console.log(`Error making request -> ${e}`);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <>
            {loading ? (
                "Loading..."
            ) : (
                <div title="Click to copy" onClick={() => navigator.clipboard.writeText(JSON.stringify(data, null, 4))}>
                    {syntaxHighlightJSON(JSON.stringify(data, null, 4))}
                </div>
            )}
        </>
    );
};
export default MyIp;
