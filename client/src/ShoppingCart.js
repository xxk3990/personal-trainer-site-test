import React  from 'react';
import { useState, useEffect } from 'react';
import { handleGet, handlePost } from './services/requests-service';
import './styles/shopping-cart.css';

export default function ShoppingCart() {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [orderTotal, setOrderTotal] = useState(0)
    const today = new Date();
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
            calcOrderTotal(parseInt(item.price));
        } else {
            const tempCart = [...cartItems];
            const itemIndex = tempCart.findIndex((product) => item.product_uuid === product.product_uuid)
            if(!tempCart[itemIndex]) {
                tempCart.push({...item, quantity: item.quantity})
                console.log("tempCart after new entry:", tempCart)
                calcOrderTotal(parseInt(item.price))
            } else {
                const prod = tempCart[itemIndex];
                tempCart[itemIndex] = {...prod, quantity: prod.quantity + item.quantity, price: parseInt(prod.price) + parseInt(item.price)}
                calcOrderTotal(parseInt(item.price));
                console.log("tempCart after existing entry:", tempCart)
            }
            setCartItems(tempCart)
            
        }
    }
    const calcOrderTotal = (currentItemPrice) => {
    //first .map is to get just the price prop, second is to convert all values to correct data type (int)
        const allPrices = cartItems.map(x => x.price).map(x => parseInt(x))
        const totalCost = allPrices.reduce(() => {
            return currentItemPrice + orderTotal;
        }, currentItemPrice)
        console.log(totalCost);
        return setOrderTotal(totalCost);
    }
    // removeItemFromCart = (item) => {
    //     cartItems.filter(() => {
    //         return cartItems !== item;
    //     })
    // }
    const submitOrder = async() => {
        const endpoint = `submitOrder`;
        const requestBody = {
            cart_items: cartItems,
            order_date: `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
            order_total: orderTotal,
            num_items: cartItems.length,
        }
        try {
            const response = await handlePost(endpoint, requestBody);
            if(response.status === 200 || response.status === 201) {
                alert("Order successful!");
                setCartItems([]);
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
   // let inCart = props.inCart
    const item = {
        product_name: p.product_name,
        product_uuid: p.uuid,
        price: p.price,
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
          <p>${p.price}</p>
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