import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handlePut } from '../services/requests-service';
export const PaymentSuccess = () => {
    const order = localStorage.getItem("orderID")
    const navigate = useNavigate()
    const submitOrder = async() => {
        const endpoint = `orders`;
        const today = new Date();
        const requestBody = {
            order_date: `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`,
            order_uuid: order
        }
        try {
            const response = await handlePut(endpoint, requestBody);
            if(response.status === 200 || response.status === 201) {
                localStorage.setItem("orderID", "");
                navigate("/userOrders")
            } else {
                alert("Order submit failed.")
            }
        } catch {
            alert("An error occurred!")
        }
    }

    setTimeout(() => {
        submitOrder();
    }, 3000)
    return (
        <div className='PaymentSuccess'>
            <section className='congrats'>
                <h1>Payment Success! Your order is being submitted...</h1>
            </section>
        </div>
       
    )
}