const getRandomArr = (length) => {
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    console.log(Array.from(array))
}

export default getRandomArr