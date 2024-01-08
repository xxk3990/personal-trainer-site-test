export const handleLogin = async (url, body) => {
    const loginParams = {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        credentials: "include",
        body: JSON.stringify(body)
    }
    return await fetch(url, loginParams)
}

export const handleLogout = async () => {
    localStorage.clear();
    const url = `http://localhost:3000/logout`
    const logoutParams = {
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        credentials: "include",
        body: ""
    }
    return await fetch(url, logoutParams)
}

export const checkAuth = async () => {
    const response = await fetch('http://localhost:3000/verify', {
        method: 'GET',
        credentials: "include"
    })
    const result = await response.json();
    if(result.authenticated === true) {
        return true;
    } else {
        return false;
    }
}