export const handleGet = async (endpoint, setDataInComponent) => {
    const url = `http://localhost:3000/${endpoint}`
    await fetch(url, {
        method: 'GET',
     //   credentials: "include"
    }).then(response => response.json(),
    []).then(responseData => {
        //The data for the component is the main setXXX variable (examples: setProducts, setOrders)
        return setDataInComponent(responseData); //set it equal to data from API
    })
}