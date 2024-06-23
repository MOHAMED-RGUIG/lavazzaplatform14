import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../actions/userActions';
import Loading from '../components/Loading';
import Error from '../components/Error';

export default function Loginscreen() {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const loginstate = useSelector(state => state.loginUserReducer);
  const { loading, error } = loginstate;
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('currentUser')) {
      window.location.href = '/';
    }
  }, []);

  function login() {
    const user = { email, password };
    console.log('Login attempt:', user); // Log the login attempt
    dispatch(loginUser(user));
  }

  return (
    <div>
      <div className='row justify-content-center mt-5'>
        <img src="https://i.postimg.cc/43kwRBYk/lavazza4.webp" alt="Lavazza" style={{}} className='col-11 col-md-11' />
        <div className='col-md-11 col-11 mt-5 text-start shadow-lg p-3 mb-5 bg-body rounded'>
          <h2 className='text-center m-2' style={{ fontSize: '35px' }}>Login</h2>

          {loading && (<Loading />)}
          {error && (<Error error='Invalid information' />)}

          <div className='container'>
            <input required type='email' placeholder='email' className='form-control'
              value={email} onChange={(e) => { setemail(e.target.value) }}
            />
            <input required type='password' placeholder='password' className='form-control'
              value={password} onChange={(e) => { setpassword(e.target.value) }}
            />
            <button onClick={login} className='btn btn-dark mt-3 mb-2 col-12 col-md-12'>LOGIN </button>
            <br />
            <a href='/register' className='text-dark col-12 col-md-12 mx-auto text-center' style={{ textDecoration: 'none', margin: '0 auto' }}>Click here to register</a>
          </div>
        </div>
      </div>
    </div>
  );
}
