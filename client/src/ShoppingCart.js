import React  from 'react';
import { useState, useEffect } from 'react';
import { handleGet, handlePost, handlePut, handleDelete } from './services/requests-service';
import { addDecimal, integerTest } from './util-methods';
import { Snackbar } from '@mui/material';
import './styles/shopping-cart.css';

export default function ShoppingCart() {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    
    const getProducts = async () => {
        const endpoint = `allProducts`
        await handleGet(endpoint, setProducts)
    }

    const getCartItems = async () => {
        //Couldn't use default request service handleGet method as I also had to calc the order total on load
        const url = `http://localhost:3000/cartItems`
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

    const updateCartItem = async (item) => {
        const endpoint = `updateCartItem`
        const requestBody = {
            item: item
        }
        console.log('updated item price:',item.price);
        const response = await handlePut(endpoint, requestBody);
        if(response.status === 200 || response.status === 201) {
            getCartItems();
        }
    }

    const deleteCartItem = async(itemToDelete) => {
        const endpoint = `deleteCartItem?product=${itemToDelete.product_uuid}`;
        return await handleDelete(endpoint)
    }

    useEffect(() => {
        document.title = "Shopping Cart"
        getProducts()
        getCartItems();
    }, []);


    const addItem = async(item) => {
        //TODO: GET DECIMAL TO ADD TO EXISTING INT AND VICE VERSA. NEARLY THERE!
        const endpoint = `addToCart`
        const tempCart = [...cartItems];
        const itemIndex = tempCart.findIndex((ci) => item.product_uuid === ci.product_uuid)
        if(!tempCart[itemIndex]) { //if it does not exist in the cart items, do POST request
            const requestBody = {
                cartItem: item,
                product_uuid: item.product_uuid,
                quantity: item.quantity,
                product_name: item.product_name,
                price: item.price,
                image_url: item.image_url
            }
            try {
                const response = await handlePost(endpoint, requestBody)
                if(response.status === 200 || response.status === 201) {
                    //if cart saving was successful, add to temp cart
                    tempCart.push({...item, price: item.price, quantity: item.quantity})
                    setCartTotal(item.price)
                    setCartItems(tempCart)
                    calcCartTotal();
                }
            } catch {
                alert("An error occurred and the item could not be added.")
            } 
        } else { //if it does, update quantity and price and call put method only
            const prod = tempCart[itemIndex];
            const unitPrice = prod.price / item.quantity
            tempCart[itemIndex] = {
                ...prod, 
                quantity: prod.quantity + 1,
                price: prod.price + unitPrice
            }
            setCartItems(tempCart);
            calcCartTotal();
            updateCartItem(tempCart[itemIndex])
        }
    }

    const decreaseQuantity = (itemReduced) => {
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
                calcCartTotal()
                deleteCartItem(itemReduced);
            }
        } else { //if quantity is > 1, reduce quantity and decrease price instead
            const reducedItemIndex = tempCart.findIndex((product) => itemReduced.product_uuid === product.product_uuid)
            const reducedItem = tempCart[reducedItemIndex];
            const unitPrice = reducedItem.price / itemReduced.quantity; //divide the price by the quantity to get the original cost
            tempCart[reducedItemIndex] = {
                ...reducedItem, 
                //subtract the current price by the price of one of its items. If its an int, leave as is. If decimal, round
                price: reducedItem.price - unitPrice,
                quantity: reducedItem.quantity - 1,
            }
            calcCartTotal()
            setCartItems(tempCart)
            updateCartItem(tempCart[reducedItemIndex]);
        }
        
    }

    const calcCartTotal = () => {
        return cartItems.map(item => {
            let total = cartTotal;
            const unitPrice = item.price / item.quantity
            total += (item.quantity * unitPrice)
            console.log("subtotal: ", total)
            return setCartTotal(total)
        })  
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
                                <Product p={p} addItem={addItem}/> 
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
                                    <Product p={p} addItem={addItem}/>
                                </section>
                            )
                        })}
                    </section>
                    <section className='basket'>
                        <ul className='cart-items-list'>
                            {cartItems.map(ci => { //ci for Cart Item
                                return <li key={ci.uuid}><CartItem ci={ci} decreaseQuantity={decreaseQuantity} addItem={addItem}/></li>
                            })}
                        </ul>
                        <footer className='cart-footer'>Total: ${!integerTest(cartTotal) ? addDecimal(cartTotal) : cartTotal } <button className='submit-order-btn' onClick={submitOrder}>Submit Order</button></footer>
                        
                    </section>
                </div>
            )
        }
    }

}

const Product = (props) => {
    const p = props.p;
    const addItem = props.addItem;
    const isInt = integerTest(p.price)
    const item = {
        product_name: p.product_name,
        product_uuid: p.uuid,
        price: p.price,
        image_url: p.image_url,
        quantity: 1
    }
    const handleClick = () => {
        //call parent "add to cart" method with child's unique product info
        addItem(item);
    }
    return (
        <section className="product-info">
          <h3 id="productname">{p.product_name}</h3>
          <p>${!isInt ? addDecimal(p.price) : p.price}</p>
          <img className="product-img-brochure" src = {p.image_url} alt={item.product_name}/>
          <button type="button" className='add-to-order-btn' onClick={handleClick}>Add to Cart</button>
        </section>
    )
}

const CartItem = (props) => {
    const ci = props.ci; //ci for Cart Item
    const decreaseQuantity = props.decreaseQuantity;
    const addItem = props.addItem;
    const isInt = integerTest(ci.price)
    const handleDecrease = () => {
        decreaseQuantity(ci);
    }
    const handleIncrease = () => {
        addItem(ci);
    }
    return (
        <section className='cart-item-li'>
            <span>{ci.quantity}</span>
            <span>{ci.product_name}</span>
            <img className="img-in-cart" src = {ci.image_url} alt={ci.product_name}/>
            <span>{!isInt ? addDecimal(ci.price) : ci.price}</span>
            <footer className='cart-item-footer'>
                <button type="button" className='item-btn' onClick={handleIncrease}> + </button>
                <button type="button" className='item-btn' onClick={handleDecrease} title='Decrease to 0 to remove completely.'> – </button>
            </footer>
        </section>
    )
}