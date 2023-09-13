import logo from './logo.svg';
import './styles/navbar.css'
import React  from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
export default function Navbar() {
    return (
        <div className='Navbar'>
            <section className='nav-loggedin'>
                <ul className = "nav-links">
                    <li className='nav-item'><Link to='/shoppingCart'>Shopping Cart</Link></li>
                    <li className='nav-item'><Link to='/orders'>Orders</Link></li>
                </ul>
            </section>
        </div>
    )
}