import React  from 'react';
import { useState, useEffect } from 'react';
import { handleGet, handlePost, handlePatch, handleDelete } from './services/requests-service';
import { addDecimal, integerTest } from './util-methods';
import { Snackbar } from '@mui/material';
import './styles/shopping-cart.css';

export default function ShoppingCart() {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0)
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const zero = 0;
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
        []).then(async responseData => {
            if(!responseData.cart_items) {
                setCartItems([]);
                setCartTotal(0);
            } else {
                const sums = await responseData.cart_totals;
                const addSums = sums.ints + sums.decs;
                if(!integerTest(addSums)) {
                    setCartTotal(Number(Number(addSums).toFixed(2)));
                } else {
                    setCartTotal(addSums);
                }
                
                
                
                setCartItems(responseData.cart_items); //set it equal to data from API
            }
            
        })
    }

    const updateCartItem = async (item) => {
        const endpoint = `updateCartItem`
        const requestBody = {
            product_uuid: item.product_uuid,
            quantity: item.quantity,
            price: item.price
        }
        console.log('updated item price:',item.price);
        const response = await handlePatch(endpoint, requestBody);
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

    const addToCart = async(item) => {
        const endpoint = `addToCart`
        if(cartItems.length === 0) { //if there is nothing in the cart at all
            const requestBody = {
                cartItem: item,
                product_uuid: item.product_uuid,
                quantity: item.quantity,
                product_name: item.product_name,
                price: Number(item.price),
                image_url: item.image_url
            }
            try {
                const response = await handlePost(endpoint, requestBody)
                if(response.status === 200 || response.status === 201) {
                    setCartItems([...cartItems, item])
                    calcCartTotal(Number(item.price), "addition");
                }
            } catch {
                alert("An error occurred and the item could not be added.")
            } 
            
        } else {
            const tempCart = [...cartItems];
            const itemIndex = tempCart.findIndex((ci) => item.product_uuid === ci.product_uuid)
            if(itemIndex === -1) { //if it does not exist in the cart items, do POST request
                const requestBody = {
                    cartItem: item,
                    product_uuid: item.product_uuid,
                    quantity: item.quantity,
                    product_name: item.product_name,
                    price: Number(item.price),
                    image_url: item.image_url
                }
                try {
                    const response = await handlePost(endpoint, requestBody)
                    if(response.status === 200 || response.status === 201) {
                        //if cart saving was successful, add to temp cart
                        tempCart.push({...item, quantity: item.quantity})
                        calcCartTotal(Number(item.price), "addition")
                        setCartItems(tempCart)
                    }
                } catch {
                    alert("An error occurred and the item could not be added.")
                } 
            } else { //if it does, update quantity and price and call patch method only
                const prod = tempCart[itemIndex];
                const isInt = integerTest(item.price);
                tempCart[itemIndex] = {
                    ...prod, 
                    quantity: prod.quantity + item.quantity,
                    price: isInt === true ? Number(prod.price) + Number(item.price) : Number(Number(Number(prod.price) + Number(item.price)).toFixed(2))
                }
                calcCartTotal(Number(item.price), "addition");
                setCartItems(tempCart);
                updateCartItem(tempCart[itemIndex])
            }
        }
    }

    const increaseQuantity = (itemIncreased) => {
        const tempCart = [...cartItems];
        const isInt = integerTest(itemIncreased.price);
        const itemIndex = tempCart.findIndex((product) => itemIncreased.product_uuid === product.product_uuid)
        const prod = tempCart[itemIndex];
        const unitPrice = Number(prod.price) / itemIncreased.quantity;
        tempCart[itemIndex] = {
            ...prod, 
            price: isInt === true ? Number(prod.price) + unitPrice : Number(Number(Number(prod.price) + unitPrice).toFixed(2)),
            quantity: prod.quantity + 1
        }
        calcCartTotal(unitPrice, "addition");
        setCartItems(tempCart);
        updateCartItem(tempCart[itemIndex]);
    }

    const decreaseQuantity = (itemReduced) => {
        const tempCart = [...cartItems];
        if(itemReduced.quantity === 1 && itemReduced.quantity !== 0) { //if going from one to zero, remove completely
            if(cartItems.length === 1) {
                deleteCartItem(itemReduced);
                setCartItems([])
            } else {
                const filteredCart = tempCart.filter((c) => {
                    return c !== itemReduced;
                })
                setCartItems(filteredCart);
                calcCartTotal(Number(itemReduced.price), "subtraction")
                deleteCartItem(itemReduced);
            }
        } else { //if quantity is > 1, reduce quantity and decrease price instead
            const reducedItemIndex = tempCart.findIndex((product) => itemReduced.product_uuid === product.product_uuid)
            const reducedItem = tempCart[reducedItemIndex];
            const isInt = integerTest(itemReduced.price)
            const unitPrice = Number(reducedItem.price) / itemReduced.quantity; //divide the price by the quantity to get the original cost
            tempCart[reducedItemIndex] = {
                ...reducedItem, 
                //subtract the current price by the price of one of its items. If its an int, leave as is. If decimal, round
                price: isInt === true ? Number(reducedItem.price) - unitPrice : Number(Number(Number(reducedItem.price) - unitPrice).toFixed(2)),
                quantity: reducedItem.quantity - 1,
            }
            calcCartTotal(unitPrice, "subtraction")
            setCartItems(tempCart)
            updateCartItem(tempCart[reducedItemIndex]);
        }
        
    }

    const calcCartTotal = (currentItemPrice, operation) => {
    //first .map is to get just the price prop, second is to convert all values to number (float or int)
        const allPrices = cartItems.map(x => x.price).map(x => Number(x))
        if(operation === "addition") {
            const totalCost = allPrices.reduce(() => {
                return currentItemPrice + cartTotal;
            }, currentItemPrice)
            console.log(totalCost);
            if(integerTest(totalCost)) {
                return setCartTotal(totalCost); //if its a whole number, add as is
            } else {
                const totalString = totalCost.toString();
                const totalSplit = totalString.split(".")
                if(totalString[totalString.length - 2] === ".") { //add zero to cents if it is less than ten
                    const decimalSide = `${totalSplit[1]}${zero}`
                    const decimalTotal = Number(`${totalSplit[0]}.${decimalSide}`).toFixed(2)
                    return setCartTotal(decimalTotal)
                } else {
                    const decimalTotal = Number(totalCost).toFixed(2)
                    console.log(decimalTotal)
                    return setCartTotal(Number(decimalTotal)); //if decimal, round
                }
                
            } 
        } else if(operation === "subtraction") {
            const totalCost = allPrices.reduce(() => {
                return cartTotal - currentItemPrice
            }, cartTotal)
            console.log(totalCost);
            if(integerTest(totalCost)) {
                return setCartTotal(totalCost); //if its a whole number, add as is
            } else {
                const totalString = totalCost.toString();
                const totalSplit = totalString.split(".")
                if(totalString[totalString.length - 2] === ".") { //add zero to cents if it is less than ten
                    const decimalSide = `${totalSplit[1]}${zero}`
                    const newFloat = Number(`${totalSplit[0]}.${decimalSide}`).toFixed(2)
                    return setCartTotal(Number(newFloat))
                } else {
                    const decimalTotal = Number(totalCost).toFixed(2)
                    return setCartTotal(Number(decimalTotal)); //if decimal, round
                }
                
            }
        }
    }

    const submitOrder = async() => {
        const endpoint = `submitOrder`;
        const today = new Date();
        const requestBody = {
            cart_items: cartItems,
            order_date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
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
                                return <li key={ci.uuid}><CartItem ci={ci} decreaseQuantity={decreaseQuantity} increaseQuantity={increaseQuantity}/></li>
                            })}
                        </ul>
                        <footer className='cart-footer'>Total: ${cartTotal} <button className='submit-order-btn' onClick={submitOrder}>Submit Order</button></footer>
                        
                    </section>
                </div>
            )
        }
    }

}

const Product = (props) => {
    const p = props.p;
    const addToCart = props.addToCart
    const isInt = integerTest(p.price);
    const formattedPrice = addDecimal(p.price);
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
    const decreaseQuantity = props.decreaseQuantity;
    const increaseQuantity = props.increaseQuantity;
    const isInt = integerTest(ci.price)
    const zero = 0;
    if(!isInt) {
        const stringPrice = ci.price.toString();
        const split = stringPrice.split('.')
        if(stringPrice[stringPrice.length - 2] === ".") {
            split[1] = `${split[1]}${zero}`
            ci.price = parseFloat(`${split[0]}.${split[1]}`).toFixed(2)
        } else {
            ci.price = Number(`${split[0]}.${split[1]}`).toFixed(2)
        }
    }
    const handleRemove = () => {
        decreaseQuantity(ci);
    }
    const handleIncrease = () => {
        increaseQuantity(ci);
    }
    return (
        <section className='cart-item-li'>
            <span>{ci.quantity}</span>
            <span>{ci.product_name}</span>
            <img className="img-in-cart" src = {ci.image_url} alt={ci.product_name}/>
            <span>{ci.price}</span>
            <footer className='cart-item-footer'>
                <button type="button" className='item-btn' onClick={handleIncrease}> + </button>
                <button type="button" className='item-btn' onClick={handleRemove} title='Decrease to 0 to remove completely.'> – </button>
            </footer>
            
            
        </section>
    )
}