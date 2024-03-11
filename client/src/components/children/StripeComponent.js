import {React} from 'react'
import "../../styles/shopping-cart.css"
import {loadStripe} from "@stripe/stripe-js"
import {Elements} from "@stripe/react-stripe-js"
import { Checkout } from './Checkout';
const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUB_KEY;
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY)
export const StripeComponent = (props) => {
    const {cartItems, cartTotal, submitOrder} = props;
    return (
        <Elements stripe={stripePromise}>
            <Checkout cartItems={cartItems} cartTotal={cartTotal} submitOrder={submitOrder}/>
        </Elements>
    )
}
