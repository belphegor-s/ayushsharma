const convertDataToObject = (data: string): Record<string, string> => {
    const keyValuePairs = data.split('\n').filter(Boolean);
    const result: Record<string, string> = {};

    keyValuePairs.forEach(pair => {
        const [key, value] = pair.split('=');
        result[key.trim()] = value.trim();
    });

    return result;
}

export default convertDataToObject;