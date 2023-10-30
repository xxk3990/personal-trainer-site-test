export const integerTest = (amount) => {
    if(Number.isInteger(amount / 100)) {
        return true;
    } else {
        return false;
    }
}

export const addDecimal = (price) => {
    return (price).toFixed(2);
}

