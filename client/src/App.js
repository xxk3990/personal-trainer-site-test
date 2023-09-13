import logo from './logo.svg';
import './App.css';
import {Routes, Route, Outlet} from 'react-router-dom';
import ShoppingCart from './ShoppingCart';

function App() {
  return (
    <Routes>
      <Route path="/shoppingCart" element={<ShoppingCart/>}/>
    </Routes>   
  );
}

export default App;
