const removeDecimalIfNeeded = (amount) => {
    const priceString = amount.toString();
    if(priceString[priceString.length - 3] === '.') { //if it contains a decimal
        const removeDecPoint = priceString.split('.') //separate each side of the decimal point
        const priceWithoutDecimal = `${removeDecPoint[0]}${removeDecPoint[1]}` //combine into single string
        return parseInt(priceWithoutDecimal); //convert combined string to integer
    } else { //otherwise just return the number as is
        return amount;
    }
}

module.exports = {removeDecimalIfNeeded}