import {React, useState} from 'react'
import { addDecimal } from '../../util-methods'
import {v4 as uuidv4} from 'uuid'
import { handleGet } from '../../services/requests-service';
import "../../styles/orders.css"
export const OrderTile = (props) => {
    //TODO: GET ALL PRODUCTS OF ORDER TO APPEAR. RIGHT NOW IT IS JUST THE FIRST ONE.
    const odr = props.odr;
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [details, setDetails] = useState([])
    const getProductsInOrder = async() => {
        const endpoint = `orderDetails?orderID=${odr.uuid}`
        await handleGet(endpoint, setDetails)
    }
    console.log("details:", details)
    return (
        <section className='order-info'>
            <h3>Date: {odr.order_date}</h3>
            <p>Amount: ${addDecimal(odr.order_total)}</p>
            <button onClick ={() => {
                getProductsInOrder()
                setShowOrderDetails(!showOrderDetails);
            }}>{showOrderDetails ? `Close ${String.fromCharCode(8593)}` : `View Details ${String.fromCharCode(8595)}`}</button>
            {
                //show and hide list of ordered products based on boolean
                showOrderDetails ? 
                <ul className='order-products-list'> 
                    {details.map(det => {
                        return (
                            <li className='order-detail' key={uuidv4()}><h4>{det.product_name}</h4>
                                <span>
                                    <p>QTY: {det.quantity}</p>
                                    <p>Price: ${addDecimal(det.price * det.quantity)}</p>
                                </span>
                            </li>
                        )
                    })} 
                </ul>
                : null
            } 
        </section>
    )
}