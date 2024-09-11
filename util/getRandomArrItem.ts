const randomArrayItem = ( arr: {[key: string] : any}[] ) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

export default randomArrayItem;