import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../actions/orderActions';
import Loading from '../components/Loading';
import { toast } from 'react-toastify';
import Error from '../components/Error';
import Success from '../components/Success';
import emailjs from 'emailjs-com';

function Checkout({ subtotal, codeClient, modalitePai, dateCmd , handleCheckout}) {
    const orderstate = useSelector(state => state.placeOrderReducer);
    const { loading, error, success } = orderstate;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const dispatch = useDispatch();

    useEffect(() => {
        if (success) {
            emailjs.send(
                'service_svoqzhm', // Replace with your EmailJS service ID
                'template_haq01pk', // Replace with your EmailJS template ID
                {
                    subtotal: subtotal,
                    clientEmail: currentUser.EMAILUSR,
                    myEmail: 'rguigmed107@gmail.com',
                    codeClient: codeClient,
                    modalitePai: modalitePai,
                    dateCmd: dateCmd
                },
                'ODWQC3grl59lJk-Vs' // Replace with your EmailJS user ID
            ).then(response => {
                console.log('Email sent successfully!', response.status, response.text);
            }).catch(err => {
                console.error('Failed to send email. Error:', err);
            });
        }
    }, [success, subtotal, codeClient, modalitePai, dateCmd, currentUser.EMAILUSR]);

    function tokenHandler() {
        dispatch(placeOrder(subtotal, codeClient, modalitePai, dateCmd));

        toast.success('Your order is added successfully!', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: false
        });
          // Call handleCheckout from Cartscreen
          handleCheckout();
    }

    return (
        <div>
            {loading && (<Loading />)}
            {error && (<Error error='Something went wrong' />)}
            {success && (<Success success='Your order placed successfully' />)}
            <button className='btn col-11 col-md-11 py-3' onClick={tokenHandler}>VALIDER LA COMMANDE</button>
        </div>
    );
}

export default Checkout;
