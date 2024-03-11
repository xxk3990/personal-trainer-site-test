import {React, useState} from 'react'
import { addDecimal } from '../../util-methods';
import { handlePost } from '../../services/requests-service';
import "../../styles/shopping-cart.css"
export const Checkout = (props) => {
    const {cartItems, cartTotal, submitOrder} = props;
    const loadStripeCheckout = async (e) => {
        e.preventDefault()
        const endpoint = `payment?user_uuid=${localStorage.getItem("user_uuid")}`
        const body = {
            cart_items: cartItems,
            cart_total: cartTotal
        }
        const response = await handlePost(endpoint, body)
        const data = await response.json();
        if(data.success) {
            submitOrder();
            setTimeout(() => {
                window.location.href = data.url
            }, 1500)
        }
    }
    return (
        <section className='checkout'>
            <button className='checkout-btn' onClick={loadStripeCheckout}>Pay</button>
        </section>
    )
}