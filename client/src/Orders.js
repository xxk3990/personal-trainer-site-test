import React  from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { handleGet, handlePost } from './services/requests-service';
import './styles/orders.css';
import { addDecimal, isWholeNumber } from './util-methods';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const getOrders = () => {
        const endpoint = `userOrders`
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
                        return <OrderTile odr={odr} />
                    })}
                </section>
            </div>
        )
    }

}
const OrderTile = (props) => {
    const odr = props.odr;
    const formattedTotal = addDecimal(odr.order_total)
    const isInt = isWholeNumber(odr.order_total);
    const newTotal = isInt === true ? odr.order_total : formattedTotal
    return (
        <section className='order-info'>
            <h3>Date: {odr.order_date}</h3>
            <p>Amount: ${newTotal}</p>
        </section>
    )
}
