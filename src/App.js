import bootstrap from '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Homescreen from './screens/Homescreen';
import Cartscreen from './screens/Cartscreen';
import Loginscreen from './screens/Loginscreen';
import Registerscreen from './screens/Registerscreen';
import CartDetailsScreen from './screens/CartDetailsScreen';
import Footer from './components/Footer';
import CartAllOrders  from './screens/CartAllOrders';

function App() {
  return (
    
    <div className="App">
      
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path='/' element={<Homescreen />} />
          <Route path='/cart' element={<Cartscreen />} />
          <Route path='/register' element={<Registerscreen />} />
          <Route path='/login' element={<Loginscreen />} />
          <Route path="/orders" element={<CartDetailsScreen/>} />
          <Route path="/allorders" element={<CartAllOrders/>} />
        </Routes>
        <Footer style={{position:'relative',bottom:'0'}} />

      </BrowserRouter>
    </div>
  );
}

export default App;
