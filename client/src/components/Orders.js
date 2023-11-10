import React  from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { handleGet } from '../services/requests-service';
import '../styles/orders.css';
import { addDecimal } from '../util-methods';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const getOrders = () => {
        const endpoint = `orders`
        handleGet(endpoint, setOrders)
    }
    useEffect(() => {
        document.title = "Your Orders"
        getOrders()
    },[])
    if(orders.length === 0) {
        return (
            <div className='Orders'>No Orders yet.</div>
        )
    } else {
        return (
            <div className='Orders'>
                <section className='orders-grid'>
                    {orders.map(odr => {
                        return <OrderTile key={odr.uuid} odr={odr} />
                    })}
                </section>
            </div>
        )
    }

}
const OrderTile = (props) => {
    const odr = props.odr;
    return (
        <section className='order-info'>
            <h3>Date: {odr.order_date}</h3>
            <p>Amount: ${addDecimal(odr.order_total)}</p>
        </section>
    )
}
