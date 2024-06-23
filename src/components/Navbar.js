import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../actions/userActions';

function Navbar() {
  const cartstate = useSelector(state => state.cartReducer);
  const userstate = useSelector(state => state.loginUserReducer);
  const { currentUser } = userstate;
  const dispatch = useDispatch();

  return (
    <div>
      <nav className="navbar navbar-expand-lg col-12 col-md-12 shadow-lg bg-body rounded">
        <div className="container-fluid ">
          {currentUser?(
             <ul className="navbar-nav mr-5">
              <li className="nav-item text-start">
                <a className="nav-link" href="/cart">    <img src="../ajouter-un-panier1.png" alt="TopClass Logo" style={{ height: '18px' }}/>(<span style={{color:'red'}}>{cartstate.cartItems.length}</span>)</a>
              </li>
            </ul>):
                    <a className="nav-link" aria-current="page" href="/login" style={{textDecoration:'none'}}>Login</a>
               
          }
       

          <a className="navbar-brand mx-auto" href="/">
            <img src="../logo.jpg" alt="TopClass Logo" style={{ height: '60px' }} />
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav"  aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto"> {/* Ajout de la classe mr-auto pour déplacer vers la gauche */}
              <div className="dropdown"> 
                {currentUser ? (
                  <>
                    <a className="dropdown-toggle nav-link text-end" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                      {currentUser.NOMUSR}
                    </a>
                    <ul className="dropdown-menu text-end" aria-labelledby="dropdownMenuButton1">
                      <li><a className="dropdown-item" href="/orders">Orders</a></li>
                      {/*<li><a className="dropdown-item" href="/allorders">AllOrders</a></li>*/}
                      <li><a className="dropdown-item" href="/login" onClick={() => dispatch(logoutUser())}>Logout</a></li>
                    </ul>
                  </>
                ) : (
                  <li className="nav-item">
                    <a className="nav-link" aria-current="page" href="/login">Login</a>
                  </li>
                )}
              </div>
            </ul>
          </div>
        
        </div>
        
          

      </nav>
    </div>
  );
}

export default Navbar;
