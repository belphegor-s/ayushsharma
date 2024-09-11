const getOdinFunctions = () => {
    const functionsAndRoutes = [
        {Type: 'API Route', Description: 'POST request to /api/hash-string along with JSON payload -> {"str": "your_string"} returns hashed string'},
        {Type: 'API Route', Description: 'POST request to /api/compare-hash-string along with JSON payload -> {"str": "your_string", "hashedStr": "your_hashed_string"} returns a boolean whether these to strings are equal'},
        {Type: 'Function', Description: 'window.getRandomId(length: number) returns random string of length passed in arg'},
        {Type: 'Function', Description: 'window.getRandomNum(length: number) returns random number of length passed in arg'},
        {Type: 'Function', Description: 'window.getRandomUUID() returns random UUID'},
        {Type: 'Function', Description: 'window.getRandomArr(length: number) returns random array of random numbers of length passed in arg'}
    ]
    console.table(functionsAndRoutes, ["Type", "Description"])
}

export default getOdinFunctions;