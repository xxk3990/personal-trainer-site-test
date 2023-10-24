export const handleGet = async (endpoint, setDataInComponent) => {
    const url = `http://localhost:3000/${endpoint}`
    await fetch(url, {
        method: 'GET',
     //   credentials: "include"
    }).then(response => response.json(),
    []).then(responseData => {
        //The data for the component is the main setXXX variable (examples: setProducts, setOrders)
        if(responseData.length === 0) {
            return setDataInComponent([])
        } else {
            return setDataInComponent(responseData); //set it equal to data from API
        }
        
    })
}

export const handlePost = async (endpoint, body) => {
    const url = `http://localhost:3000/${endpoint}`;
        const requestParams = {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            //"Authorization": `Bearer ${token}` 
            },
        // credentials: 'include',
            body: JSON.stringify(body)
        }
    return fetch(url, requestParams)
}

export const handlePut = async (endpoint, body) => {
    const url = `http://localhost:3000/${endpoint}`;
    const requestParams = {
        method: "PUT",
        headers: {
            "Content-Type": 'application/json',
            //"Authorization": `Bearer ${token}` 
        },
        // credentials: 'include',
        body: JSON.stringify(body)
    }
    return fetch(url, requestParams)
}

export const handleDelete = (endpoint) => {
    const url = `http://localhost:3000/${endpoint}`
    const requestParams = {
        method: 'DELETE',
        headers: {
            "Content-Type": 'application/json',
            //"Authorization": `Bearer ${token}` 
        },
        //credentials: 'include',
    }
    return fetch(url, requestParams)
}