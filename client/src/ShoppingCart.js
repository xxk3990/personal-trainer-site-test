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
            calcOrderTotal(Number(item.price));
        } else {
            const tempCart = [...cartItems];
            const itemIndex = tempCart.findIndex((product) => item.product_uuid === product.product_uuid)
            if(!tempCart[itemIndex]) {
                tempCart.push({...item, quantity: item.quantity})
                calcOrderTotal(Number(item.price))
            } else {
                const prod = tempCart[itemIndex];
                const isInt = isWholeNumber(Number(item.price));
                tempCart[itemIndex] = {
                    ...prod, 
                    quantity: prod.quantity + item.quantity, 
                    price: isInt === true ? Number(prod.price) + Number(item.price) : Number(Number(Number(prod.price) + Number(item.price)).toFixed(2))
                }
                calcOrderTotal(Number(item.price));
            }
            setCartItems(tempCart)
            
        }
    }
    const calcOrderTotal = (currentItemPrice) => {
    //first .map is to get just the price prop, second is to convert all values to number (float or int)
        const allPrices = cartItems.map(x => x.price).map(x => Number(x))
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
    }
    // removeItemFromCart = (item) => {
    //     cartItems.filter(() => {
    //         return cartItems !== item;
    //     })
    // }
    const submitOrder = async() => {
        const endpoint = `submitOrder`;
        const today = new Date();
        const requestBody = {
            cart_items: cartItems,
            order_date: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
            order_total: orderTotal,
        }
        try {
            const response = await handlePost(endpoint, requestBody);
            if(response.status === 200 || response.status === 201) {
                setOpenSnackbar(true);
                setTimeout(() => {
                    setOpenSnackbar(false);
                    setCartItems([]);
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
                    <Snackbar open={openSnackbar} autoHideDuration={1500} message="Order Submitted Successfully!" anchorOrigin={{horizontal: "center", vertical:"top"}}/>
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
                                return <li key={ci.id}><CartItem ci={ci}/></li>
                            })}
                        </ul>
                        <span className='order-total'>Total: ${orderTotal}</span>
                        <button className='submit-order-btn' onClick={submitOrder}>Submit Order</button>
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
        quantity: 1
    }
    const handleClick = () => {
        //call parent "add to cart" method with child's unique product info
        addToCart(item);
    }
    // const handleRemove = () => {

    // }
    return (
        <section className="product-info">
          <h3 id="productname">{p.product_name}</h3>
          <p>${item.price}</p>
          <button type="button" className='add-to-order-btn' onClick={handleClick}>Add to Cart</button>
        </section>
    )
}

const CartItem = (props) => {
    const ci = props.ci; //ci for Cart Item
    return (
        <span>{ci.quantity}&nbsp;{ci.product_name}, {ci.price}</span> //will include image in future
    )
}