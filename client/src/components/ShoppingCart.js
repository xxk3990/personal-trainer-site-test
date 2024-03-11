import React  from 'react';
import { useState, useEffect } from 'react';
import { handleGet, handlePost, handlePut, handleDelete } from '../services/requests-service'
import { addDecimal } from '../util-methods';
import { Snackbar } from '@mui/material';
import {v4 as uuidv4} from 'uuid'
import '../styles/shopping-cart.css';
import {useNavigate} from "react-router-dom"
import { checkAuth } from '../services/auth-service';
import { CartItem } from './children/CartItem';
import { CatalogItem } from './children/CatalogItem';
import { StripeComponent } from './children/StripeComponent';
export default function ShoppingCart() {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const navigate = useNavigate();
    const [showCheckout, setShowCheckout] = useState(false);

    const getProducts = async () => {
        const endpoint = `products`
        await handleGet(endpoint, setProducts)
    }

    const getCartItems = async () => {
        const orderID = localStorage.getItem("orderID")
        const authorized = await checkAuth()
        if(authorized === false) {
            localStorage.clear();
            navigate("/login")
        } else {
            if(orderID === null || orderID === "") {
                return;
            } else {
                //Couldn't use default request service handleGet method as I also had to calc the order total on load
                const host = process.env.REACT_APP_NODE_LOCAL || process.env.REACT_APP_NODE_PROD
                const url = `${host}/order-items?orderID=${orderID}&userID=${localStorage.getItem("user_uuid")}`
                await fetch(url, {
                    method: 'GET',
                    credentials: "include"
                }).then(response => response.json(),
                []).then(responseData => {
                    if(!responseData.cart_items) {
                        setCartTotal(0)
                        setCartItems([]); 
                    } else {
                        setCartTotal(responseData.cart_total)
                        console.log("cartItems from DB: ", responseData.cart_items)
                        //sort response data by created at (newer items at the end) so order can't change
                        const sortedCart = responseData.cart_items.sort((x, y) => new Date(x.createdAt) - new Date(y.createdAt))
                        setCartItems(sortedCart) //set it equal to data from API
                    }
                    
                })
            }
        }   
       
    }

    const viewCheckout = () => {
        setShowCheckout(!showCheckout);
    }


    useEffect(() => {
        document.title = "Shopping Cart"
        getProducts()
        getCartItems()
    }, []);


    const addCartItem = async(item) => {
    //if cart is empty, POST to new order. Create order method on BE creates first order_item.
        const authorized = await checkAuth()
        if(authorized === false) {
            localStorage.clear();
            navigate('/');
        } else {
            const useruuid = localStorage.getItem("user_uuid")
            if(cartItems.length === 0) { 
                const today = new Date()
                const endpoint = `orders?userID=${useruuid}`
                const requestBody = {
                    user_uuid: localStorage.getItem("user_uuid"),
                    item: item,
                    order_date: `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`,
                    order_total: item.price
                }
                try {
                    const response = await handlePost(endpoint, requestBody)
                    if(response.status === 200 || response.status === 201) {
                        const data = await response.json();
                        console.log(data)
                        setCartItems([...cartItems, item])
                        localStorage.setItem("orderID", data.order_uuid)
                        getCartItems()
                    }
                } catch {
                    alert("An error occurred and the item could not be added.")
                } 
            } else {
                const endpoint = `order-items?userID=${useruuid}`
                const tempCart = [...cartItems];
                const itemIndex = tempCart.findIndex((ci) => item.product_uuid === ci.product_uuid)
                if(itemIndex === -1) { //if it does not exist in the cart but cart len is not 0, POST to /order-items
                    const orderID = localStorage.getItem("orderID")
                    const requestBody = {
                        product_uuid: item.product_uuid,
                        quantity: item.quantity,
                        order_uuid: orderID
                    }
                    try {
                        const response = await handlePost(endpoint, requestBody)
                        if(response.status === 200 || response.status === 201) {
                            console.log()
                            tempCart.push({...item, quantity: item.quantity})
                            setCartItems(tempCart)
                            getCartItems();
                        }
                    } catch {
                        alert("An error occurred and the item could not be added.")
                    } 
                } else { //if it does, update quantity and price and then call submit update method
                    const itemToIncrease = tempCart[itemIndex];
                    console.log("PUT code hit")
                    tempCart[itemIndex] = {
                        ...itemToIncrease, 
                        quantity: itemToIncrease.quantity + 1,
                    }
                    setCartItems(tempCart);
                    submitCartUpdate(tempCart[itemIndex]) //submit item update to DB
                }
            }
        }
    }

    const decreaseCartItem = (itemReduced) => {
        const tempCart = [...cartItems];
        if(itemReduced.quantity === 1 && itemReduced.quantity !== 0) { //if going from one to zero, remove completely
            if(cartItems.length === 1) { 
            //if it is the last item in the cart, reset everything after deleting
                submitCartDelete(itemReduced);
                setCartItems([])
                setCartTotal(0);
                localStorage.setItem("orderID", "");
            } else { //if not, only take it out of the cart
                const filteredCart = tempCart.filter((c) => {
                    return c !== itemReduced;
                })
                setCartItems(filteredCart);
                submitCartDelete(itemReduced);
            }
        } else { //if quantity is > 1, reduce quantity and price and call submit update to DB instead
            const reducedItemIndex = tempCart.findIndex((product) => itemReduced.product_uuid === product.product_uuid)
            const reducedItem = tempCart[reducedItemIndex];
            tempCart[reducedItemIndex] = {
                ...reducedItem, 
                quantity: reducedItem.quantity - 1,
            }
            setCartItems(tempCart)
            submitCartUpdate(tempCart[reducedItemIndex]); //submit update to DB
        }
        
    }

    const submitCartUpdate = async (item) => {
        const endpoint = `order-items`
        console.log(item)
        const requestBody = {
            item_uuid: item.uuid,
            order_uuid: localStorage.getItem("orderID"),
            product_uuid: item.product_uuid,
            quantity: item.quantity,
        }
        const response = await handlePut(endpoint, requestBody);
        if(response.status === 200 || response.status === 201) {
            getCartItems();
        }
    }

    const submitCartDelete = async(itemToDelete) => {
        console.log(itemToDelete)
        setSnackbarMessage("");
        const endpoint = `order-items?item=${itemToDelete.uuid}&order=${itemToDelete.order_uuid}&product=${itemToDelete.product_uuid}&quantity=${itemToDelete.quantity}`;
        const response = await handleDelete(endpoint)
        setOpenSnackbar(true);
        setSnackbarMessage("Removing item...");
        if(response.status === 200) {
            setTimeout(() => {
                setOpenSnackbar(false);
                setSnackbarMessage("");
                getCartItems();
            }, 750)
        } else {
            setOpenSnackbar(true);
            setSnackbarMessage("Removal failed.");
            setTimeout(() => {
                setOpenSnackbar(false);
                setSnackbarMessage("");
            }, 750)
        }
    }


    //TODO: HANDLE ORDER UPDATE TO DB AFTER STRIPE PAYMENT SUCCESS
    const submitOrder = async() => {
        const endpoint = `orders`;
        const today = new Date();
        const requestBody = {
            order_date: `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`,
            order_uuid: localStorage.getItem("orderID")
        }
        try {
            const response = await handlePut(endpoint, requestBody);
            if(response.status === 200 || response.status === 201) {
                setSnackbarMessage("") //clear current msg
                setOpenSnackbar(true);
                setSnackbarMessage("Loading Payment Screen..."); //set it to order successful
                setTimeout(() => {
                    setOpenSnackbar(false);
                    setCartItems([]);
                    setCartTotal(0);
                    setSnackbarMessage("");
                    localStorage.setItem("orderID", "");
                }, 1500)
            } else {
                setOpenSnackbar(true);
                setSnackbarMessage("Order submit failed."); //or order failed
                setTimeout(() => {
                    setOpenSnackbar(false);
                    setSnackbarMessage("");
                }, 1500)
            }
        } catch {
            alert("An error occurred!")
        }
    }
    if(products.length === 0) {
        return (
          <div className="ShoppingCart">
            <h4>No products found.</h4>
          </div>
        )
    } else {
        if(cartItems.length === 0) {
            return (
                <div className="ShoppingCart">
                  <h1>Shopping Cart</h1>
                  <section key={uuidv4()} className='products-grid'>
                    {products.map(p => {
                        return (
                            <section key={p.uuid} className='product-details'>
                            {/* give props and add to cart method to specific product */}
                                <CatalogItem p={p} addCartItem={addCartItem}/> 
                            </section>
                        )
                    })}
                  </section>
                </div>
            );
        } else {
            return (
                <div className="ShoppingCart">
                    <Snackbar sx={{width: 10}} ContentProps={{sx: {display: 'block', textAlign: "center", fontSize: "16px"}}} className='cart-snackbar' open={openSnackbar} autoHideDuration={1500} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
                    <h1>Shopping Cart</h1>
                    <section key={uuidv4()} className = "products-grid">
                        {products.map(p => {
                            return (
                                <section key={p.uuid} className='product-details'>
                                    <CatalogItem p={p} addCartItem={addCartItem}/>
                                </section>
                            )
                        })}
                    </section>
                    <section key={uuidv4()} className='basket'>
                        <ul className='cart-items-list'>
                            {cartItems.map(ci => { //ci for Cart Item
                                console.log("cartTotal:", cartTotal);
                                return <li key={uuidv4()}><CartItem ci={ci} decreaseCartItem={decreaseCartItem} addCartItem={addCartItem} submitCartDelete={submitCartDelete}/></li>
                            })}
                        </ul>
                        <footer className='cart-footer'>
                           <span><p>Total: ${addDecimal(cartTotal)}</p> <button className='submit-order-btn' onClick={viewCheckout}>Checkout</button></span>
                            {showCheckout ? <StripeComponent cartItems={cartItems} cartTotal = {cartTotal} submitOrder={submitOrder}/> : null}
                        </footer>
                    </section>
                    
                </div>

            )
        }
    }

}



