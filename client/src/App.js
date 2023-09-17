import logo from './logo.svg';
import './App.css';
import {Routes, Route, Outlet} from 'react-router-dom';
import ShoppingCart from './ShoppingCart';
import Orders from './Orders';

function App() {
  return (
    <Routes>
      <Route path="/shoppingCart" element={<ShoppingCart/>}/>
      <Route path="/userOrders" element={<Orders/>}/>
    </Routes>   
  );
}

export default App;
