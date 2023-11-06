import React  from 'react';
import { useState, useEffect } from 'react';
import { handleGet, handlePost, handlePut, handleDelete } from '../services/requests-service'
import { addDecimal, integerTest } from '../util-methods';
import { Snackbar } from '@mui/material';
import '../styles/shopping-cart.css';

export default function ShoppingCart() {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    
    const getProducts = async () => {
        const endpoint = `products`
        await handleGet(endpoint, setProducts)
    }

    const getCartItems = async () => {
        //Couldn't use default request service handleGet method as I also had to calc the order total on load
        const host = process.env.REACT_APP_BASEURL_LOCAL || process.env.REACT_APP_BASEURL_PROD
        const url = `${host}/cartItems`
        await fetch(url, {
            method: 'GET',
        }).then(response => response.json(),
        []).then(responseData => {
            if(!responseData.cart_items) {
                setCartTotal(0)
                setCartItems([]); 
            } else {
                setCartTotal(responseData.cart_total)
                setCartItems(responseData.cart_items) //set it equal to data from API
            }
            
        })
    }

    const deleteCartItem = async(itemToDelete) => {
        const endpoint = `deleteCartItem?product=${itemToDelete.product_uuid}`;
        await handleDelete(endpoint)
        getCartItems();
    }

    const calcUnitPrice = (price, quantity) => price / quantity;

    useEffect(() => {
        document.title = "Shopping Cart"
        getProducts()
        getCartItems();
    }, []);


    const addCartItem = async(item) => {
        const endpoint = `addToCart`
        const tempCart = [...cartItems];
        const itemIndex = tempCart.findIndex((ci) => item.product_uuid === ci.product_uuid)
        if(itemIndex === -1) { //if it does not exist in the cart items, do POST request
            const requestBody = {
                cartItem: item,
                product_uuid: item.product_uuid,
                quantity: item.quantity,
                product_name: item.product_name,
                price: item.price,
                image_url: item.image_url
            }
            console.log("new item price:", item.price);
            try {
                const response = await handlePost(endpoint, requestBody)
                if(response.status === 200 || response.status === 201) {
                    const data = await response.json();
                    console.log()
                    if(cartItems.length === 0) {
                        setCartItems([...cartItems, item])
                    } else {
                        tempCart.push({...item, quantity: item.quantity})
                        setCartItems(tempCart)
                    }
                    
                    getCartItems()
                }
            } catch {
                alert("An error occurred and the item could not be added.")
            } 
        } else { //if it does, update quantity and price and then call UPDATE item method
            const prod = tempCart[itemIndex];
            console.log("PUT code hit")
            const unitPrice = calcUnitPrice(prod.price, prod.quantity)
            console.log("PUT Unit price:", unitPrice)
            tempCart[itemIndex] = {
                ...prod, 
                quantity: prod.quantity + 1,
                price: prod.price + unitPrice
            }
            setCartItems(tempCart);
            submitCartUpdate(tempCart[itemIndex])
        }
    }

    const decreaseCartItem = (itemReduced) => {
        const tempCart = [...cartItems];
        if(itemReduced.quantity === 1 && itemReduced.quantity !== 0) { //if going from one to zero, remove completely
            if(cartItems.length === 1) {
                deleteCartItem(itemReduced);
                setCartItems([])
                setCartTotal(0);
            } else {
                const filteredCart = tempCart.filter((c) => {
                    return c !== itemReduced;
                })
                setCartItems(filteredCart);
                deleteCartItem(itemReduced);
            }
        } else { //if quantity is > 1, reduce quantity and decrease price instead
            const reducedItemIndex = tempCart.findIndex((product) => itemReduced.product_uuid === product.product_uuid)
            const reducedItem = tempCart[reducedItemIndex];
            const unitPrice = calcUnitPrice(reducedItem.price, itemReduced.quantity) //divide the price by the quantity to get the original cost
            tempCart[reducedItemIndex] = {
                ...reducedItem, 
                //subtract the current price by the price of one of its items. If its an int, leave as is. If decimal, round
                price: reducedItem.price - unitPrice,
                quantity: reducedItem.quantity - 1,
            }
            setCartItems(tempCart)
            submitCartUpdate(tempCart[reducedItemIndex]);
        }
        
    }

    const submitCartUpdate = async (item) => {
        const endpoint = `updateCartItem`
        console.log(item)
        const requestBody = {
            item: item,
            price: item.price
        }
        console.log('updated item price:',item.price);
        const response = await handlePut(endpoint, requestBody);
        if(response.status === 200 || response.status === 201) {
            getCartItems();
        }
    }

    const submitOrder = async() => {
        const endpoint = `submitOrder`;
        const today = new Date();
        const requestBody = {
            cart_items: cartItems,
            order_date: `${today.getMonth() + 1}-${today.getDate()}-${today.getFullYear()}`,
            order_total: cartTotal,
        }
        try {
            const response = await handlePost(endpoint, requestBody);
            if(response.status === 200 || response.status === 201) {
                setOpenSnackbar(true);
                setSnackbarMessage("Order Submitted Successfully!");
                setTimeout(() => {
                    setOpenSnackbar(false);
                    setCartItems([]);
                    setCartTotal(0);
                    setSnackbarMessage("");
                }, 1500)
            } else {
                setOpenSnackbar(true);
                setSnackbarMessage("Order Failed.");
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
                  <section className='products-grid'>
                    {products.map(p => {
                        return (
                            <section className='product-details'>
                            {/* give props and add to cart method to specific product */}
                                <Product p={p} addCartItem={addCartItem}/> 
                            </section>
                        )
                    })}
                  </section>
                </div>
            );
        } else {
            return (
                <div className="ShoppingCart">
                    <Snackbar open={openSnackbar} autoHideDuration={1500} message={snackbarMessage} anchorOrigin={{horizontal: "center", vertical:"top"}}/>
                    <h1>Shopping Cart</h1>
                    <section className = "products-grid">
                        {products.map(p => {
                            return (
                                <section className='product-details'>
                                    <Product p={p} addCartItem={addCartItem}/>
                                </section>
                            )
                        })}
                    </section>
                    <section className='basket'>
                        <ul className='cart-items-list'>
                            {cartItems.map(ci => { //ci for Cart Item
                                console.log("cartTotal:", cartTotal);
                                return <li key={ci.uuid}><CartItem ci={ci} decreaseCartItem={decreaseCartItem} addCartItem={addCartItem}/></li>
                            })}
                        </ul>
                        <footer className='cart-footer'>Total: ${addDecimal(cartTotal)} <button className='submit-order-btn' onClick={submitOrder}>Submit Order</button></footer>
                        
                    </section>
                </div>
            )
        }
    }

}

const Product = (props) => {
    const p = props.p;
    const addCartItem = props.addCartItem;
    const item = {
        product_name: p.product_name,
        product_uuid: p.uuid,
        price: p.price,
        image_url: p.image_url,
        quantity: 1
    }
    const handleClick = () => {
        //call parent "add to cart" method with child's unique product info
        addCartItem(item);
    }
    return (
        <section className="product-info">
          <h3 id="productname">{p.product_name}</h3>
          <p>${addDecimal(p.price)}</p>
          <img className="product-img-brochure" src = {p.image_url} alt={item.product_name}/>
          <button type="button" className='add-to-order-btn' onClick={handleClick}>Add to Cart</button>
        </section>
    )
}

const CartItem = (props) => {
    const ci = props.ci; //ci for Cart Item
    const decreaseCartItem = props.decreaseCartItem;
    const addCartItem = props.addCartItem;
    const handleDecrease = () => {
        decreaseCartItem(ci);
    }
    const handleIncrease = () => {
        addCartItem(ci);
    }
    return (
        <section className='cart-item-li'>
            <span>{ci.quantity}</span>
            <span>{ci.product_name}</span>
            <img className="img-in-cart" src = {ci.image_url} alt={ci.product_name}/>
            <span>{addDecimal(ci.price)}</span>
            <footer className='cart-item-footer'>
                <button type="button" className='item-btn' onClick={handleIncrease}> + </button>
                <button type="button" className='item-btn' onClick={handleDecrease} title='Decrease to 0 to remove completely.'> – </button>
            </footer>
        </section>
    )
}