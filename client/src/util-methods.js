export const isWholeNumber = (amount) => {
    if(Number.isInteger(amount / 100)) {
        return true;
    } else {
        return false;
    }
}


export const addDecimal = (amount) => {
   return (amount / 100).toFixed(2);
}