import React  from 'react';
import { useState, useEffect } from 'react';
import { handleGet, handlePost } from './services/requests-service';
import { addDecimal, isWholeNumber } from './util-methods';
import { Snackbar } from '@mui/material';
import './styles/shopping-cart.css';

export default function ShoppingCart() {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [orderTotal, setOrderTotal] = useState(0)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const getProducts = async () => {
        const endpoint = `allProducts`
        handleGet(endpoint, setProducts)
    }
    useEffect(() => {
        document.title = "Shopping Cart"
        getProducts()
    }, []);
    const addToCart = (item) => {
        if(cartItems.length === 0) {
            setCartItems([...cartItems, item])
            calcOrderTotal(Number(item.price), "addition", item.quantity);
        } else {
            const tempCart = [...cartItems];
            const itemIndex = tempCart.findIndex((product) => item.product_uuid === product.product_uuid)
            if(!tempCart[itemIndex]) {
                tempCart.push({...item, quantity: item.quantity})
                calcOrderTotal(Number(item.price), "addition", item.quantity)
            } else {
                const prod = tempCart[itemIndex];
                const isInt = isWholeNumber(Number(item.price));
                tempCart[itemIndex] = {
                    ...prod, 
                    quantity: prod.quantity + item.quantity, 
                    price: isInt === true ? Number(prod.price) + Number(item.price) : Number(Number(Number(prod.price) + Number(item.price)).toFixed(2))
                }
                calcOrderTotal(Number(item.price), "addition", item.quantity);
            }
            setCartItems(tempCart)
            
        }
    }

    const removeFromCart = (itemRemoved) => {
        const tempCart = [...cartItems];
        if(itemRemoved.quantity === 1 && itemRemoved.quantity !== 0) { //if going from one to zero, remove completely
            const filteredCart = tempCart.filter((c) => {
                return c !== itemRemoved;
            })
            setCartItems(filteredCart);
            calcOrderTotal(Number(itemRemoved.price), "subtraction", itemRemoved.quantity)
        } else { //if quantity is > 1, reduce quantity and decrease price instead
            const reducedItemIndex = tempCart.findIndex((product) => itemRemoved.product_uuid === product.product_uuid)
            const reducedItem = tempCart[reducedItemIndex];
            const isInt = isWholeNumber(Number(itemRemoved.price))
            const unitPrice = Number(reducedItem.price) / itemRemoved.quantity; //divide the price by the quantity to get the original cost
            tempCart[reducedItemIndex] = {
                ...reducedItem, 
                //subtract the current price by the price of one of its items. If its an int, leave as is. If decimal, round
                price: isInt === true ? Number(reducedItem.price) - unitPrice :  Number(Number(Number(reducedItem.price) - unitPrice).toFixed(2)),
                quantity: reducedItem.quantity - 1,
            }
            calcOrderTotal(Number(itemRemoved.price), "subtraction", itemRemoved.quantity)
            setCartItems(tempCart)
        }
        
    }

    const calcOrderTotal = (currentItemPrice, operation, currentItemQuantity) => {
    //first .map is to get just the price prop, second is to convert all values to number (float or int)
        const allPrices = cartItems.map(x => x.price).map(x => Number(x))
        if(operation === "addition") {
            const totalCost = allPrices.reduce(() => {
                return currentItemPrice + orderTotal;
            }, currentItemPrice)
            console.log(totalCost);
            const isInt = isWholeNumber(totalCost);
            if(isInt) {
                return setOrderTotal(totalCost); //if its a whole number, add as is
            } else {
                return setOrderTotal(Number(Number(totalCost).toFixed(2))); //if decimal, round
            } 
        } else if(operation === "subtraction") {
            const unitPrice = currentItemPrice / currentItemQuantity;
            const totalCost = allPrices.reduce(() => {
                return orderTotal - unitPrice
            }, orderTotal)
            const isInt = isWholeNumber(totalCost);
            console.log(totalCost);
            if(isInt) {
                return setOrderTotal(totalCost); //if its a whole number, add as is
            } else {
                return setOrderTotal(Number(Number(totalCost).toFixed(2))); //if decimal, round
            }
        }
    }

    const submitOrder = async() => {
        const endpoint = `submitOrder`;
        const today = new Date();
        const requestBody = {
            cart_items: cartItems,
            order_date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
            order_total: orderTotal,
        }
        try {
            const response = await handlePost(endpoint, requestBody);
            if(response.status === 200 || response.status === 201) {
                setOpenSnackbar(true);
                setSnackbarMessage("Order Submitted Successfully!");
                setTimeout(() => {
                    setOpenSnackbar(false);
                    setCartItems([]);
                    setOrderTotal(0);
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
                                <Product p={p} addToCart={addToCart}/> 
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
                                    <Product p={p} addToCart={addToCart}/>
                                </section>
                            )
                        })}
                    </section>
                    <section className='basket'>
                        <ul className='cart-items-list'>
                            {cartItems.map(ci => { //ci for Cart Item
                                return <li key={ci.uuid}><CartItem ci={ci} removeFromCart={removeFromCart}/></li>
                            })}
                        </ul>
                        <footer className='cart-footer'>Total: ${orderTotal} <button className='submit-order-btn' onClick={submitOrder}>Submit Order</button></footer>
                        
                    </section>
                </div>
            )
        }
    }

}

const Product = (props) => {
    const p = props.p;
    const addToCart = props.addToCart
    const formattedPrice = addDecimal(p.price);
    const isInt = isWholeNumber(Number(p.price));
    const item = {
        product_name: p.product_name,
        product_uuid: p.uuid,
        price: isInt === true ? p.price : formattedPrice,
        image_url: p.image_url,
        quantity: 1
    }
    const handleClick = () => {
        //call parent "add to cart" method with child's unique product info
        addToCart(item);
    }
    return (
        <section className="product-info">
          <h3 id="productname">{p.product_name}</h3>
          <p>${item.price}</p>
          <img className="product-img-brochure" src = {p.image_url} alt={item.product_name}/>
          <button type="button" className='add-to-order-btn' onClick={handleClick}>Add to Cart</button>
        </section>
    )
}

const CartItem = (props) => {
    const ci = props.ci; //ci for Cart Item
    const removeFromCart = props.removeFromCart;
    const handleClick = () => {
        removeFromCart(ci);
    }
    return (
        <section className='cart-item-li'>
            <span>{ci.quantity}</span>
            <span>{ci.product_name}</span>
            <img className="img-in-cart" src = {ci.image_url} alt={ci.product_name}/>
            <span>{ci.price}</span>
            <button type="button" className='remove-from-order-btn' onClick={handleClick}> – </button>
        </section>
    )
}