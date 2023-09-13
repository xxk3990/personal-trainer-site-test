import React  from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { handleGet } from './services/requests-service';
import './styles/shopping-cart.css';

export default function ShoppingCart() {
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const getProducts = async () => {
        const endpoint = `allProducts`
        handleGet(endpoint, setProducts)
    }
    useEffect(() => {
        document.title = "Shopping Cart"
        getProducts()
    }, []);
    const addToCart = (item) => {
        setCartItems([...cartItems, item])
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
                  <section className='products'>
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
            console.log(cartItems)
            return (
                <div className="ShoppingCart">
                    <h1>Shopping Cart</h1>
                    <section className='products'>
                        <section className = "products-grid">
                            {products.map(p => {
                                return (
                                    <section className='product-details'>
                                        <Product p={p} addToCart={addToCart}/>
                                    </section>
                                )
                            })}
                        </section>
                    </section>
                    <section className='basket'>
                        <ul className='cart-items-list'>
                            {cartItems.map(ci => { //ci for Cart Item
                                return <li><CartItem ci={ci}/></li>
                            })}
                        </ul>
                    </section>
                </div>
            )
        }
    }

}

const Product = (props) => {
    const p = props.p;
    const addToCart = props.addToCart
    const handleClick = () => {
        //call parent "add to cart" method with child's unique product info
        addToCart(p);
    }
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
        <span>{ci.product_name}, {ci.price}</span> //will include image in future
    )
}