import { useState } from "react";
const NODE_URL = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
export const useLocalStorage = (keyName) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const value = localStorage.getItem(keyName);
            if (value) {
                return value;
            } else {
                localStorage.setItem(keyName, JSON.stringify(null));
                return null;
            }
        } catch (err) {
            return null;
        }
    });
    const setValue = (newValue) => {
        try {
            localStorage.setItem(keyName, JSON.stringify(newValue));
        } catch (err) {}
        setStoredValue(newValue);
    };
    return [storedValue, setValue];
};

export const handleLogin = async (url, body) => {
    console.log(url);
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
    const url = `${NODE_URL}/logout`
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
    const response = await fetch(`${NODE_URL}/verify`, {
        method: 'GET',
        credentials: "include"
    })
    const result = await response.json();
    if (result.authenticated === true) {
        return true;
    } else {
        return false;
    }
}

export const minsTillLogout = (now) => { 
    const loginTime = localStorage.getItem("loginTime")
    const expiration = localStorage.getItem("expiration")
    const msecsSince = now - loginTime; //get milliseconds since user logged in
    const minsSince = msecsSince / 60000; //convert it to minutes
    const minsLeft = expiration - minsSince; //subtract # of minutes logged in from token exp time
    return Math.floor(minsLeft); //round off decimals
}