import React  from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { handleGet } from '../services/requests-service';
import '../styles/orders.css';
import { checkAuth } from '../services/auth-service';
import { OrderTile } from './children/OrderTile';
import {v4 as uuidv4} from 'uuid'
export default function Orders() {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const getOrders = async() => {
        const authorized = await checkAuth()
        if(authorized === false) {
            localStorage.clear();
            navigate("/login")
        }
        const endpoint = `orders?userID=${localStorage.getItem("user_uuid")}`
        handleGet(endpoint, setOrders)
    }
    useEffect(() => {
        document.title = "Your Orders"
        getOrders()
    },[])
    const sortedOrders = orders.sort((x, y) => new Date(y.updatedAt) - new Date(x.updatedAt))
    if(orders.length === 0) {
        return (
            <div className='Orders'>No Orders yet.</div>
        )
    } else {
        return (
            <div className='Orders'>
                <h1>Completed Orders</h1>
                <section className='orders-grid'>
                    {sortedOrders.map(odr => {
                        return <OrderTile key={uuidv4()} odr={odr} />
                    })}
                </section>
            </div>
        )
    }

}
