import logo from './logo.svg';
import './App.css';
import {Routes, Route, Outlet} from 'react-router-dom';
import ShoppingCart from './ShoppingCart';
import Orders from './Orders';
import Products from './Products';
import Navbar from './Navbar';

function App() {
  return (
    <Routes>
      <Route element={<> <Navbar/> <Outlet /></>}>
        <Route path="/shoppingCart" element={<ShoppingCart/>}/>
        <Route path="/userOrders" element={<Orders/>}/>
        <Route path="/adminProducts" element={<Products/>}/>
      </Route>
    </Routes>   
  );
}

export default App;
