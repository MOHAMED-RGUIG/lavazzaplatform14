import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';
import { toast } from 'react-toastify';

export default function Product({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [show, setShow] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();

  function addtocart() {
    const selectedQuantity = parseInt(quantity, 10) || 1;
    dispatch(addToCart(product, selectedQuantity, isChecked));
    toast.success('Product added to cart!', {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: false
    });
  }

  const calculatedPrice = isChecked ? 0 : product.Montant_TTC * quantity;
  const isMachineCategory = ['Machines Lavazza Firma','Nos Machines', 'Machines Grain Necta', 'Machines Lavazza Blue', 'Machines Lavazza Espresso Point', 'Machines Lavazza Amodo Mio', 'Machines Grain Gaggia', 'Machines Grain SAECO', 'Machine Grain Spaziale', 'Machines Grain Carimali'].includes(product.Categorie);

  return (
    <div style={{ margin: '5px', backgroundColor: '#f3f3f3', border: '0px solid #ddd', borderRadius: '8px' }} className='mb-2 mt-4'>
      <div onClick={handleShow}>
        <h1 style={{ backgroundColor: '#f0f0f0' }} className='pt-3'>{product.Nom}</h1>
        <img src={product.Image} alt='product' className='img-fluid mb-5 mt-4' style={{ height: '130px', width: '150px' }} />
      </div>
      <div className='flex-container'>
      <div className='w-100'>
    <label>
      <input
        type='checkbox'
        checked={isChecked}
        onChange={handleCheckboxChange}
        className='mx-2'
      />
      {isMachineCategory ? 'Dépots?' : 'Gratuit?'}
    </label>
  </div>
        <div className='w-100 m-2'> 
          <h6>Quantity</h6>
          <input
            type='number'
            className='form-control'
            value={quantity}
            onChange={(e) => {
              const value = parseInt(e.target.value);
              if (isNaN(value)) {
                setQuantity('');
              } else {
                setQuantity(Math.max(value, 1));
              }
            }} 
            min={1} 
          />
        </div>
      </div>
      <div className='flex-container pb-3'>
        <div className='m-1 w-100'>
          <h5 className=''><br />{calculatedPrice} DH TTC</h5>
        </div>
        <div className='m-1 w-100 mt-3'>
          <button className='btn' onClick={addtocart}>ADD TO CART</button>
        </div>
      </div>
      <Modal show={show}>
        <Modal.Header closeButton onClick={handleClose}>
          <Modal.Title>{product.Nom}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={product.Image} alt='product' className='img-fluid' style={{ height: '400px' }} />
          <p>{product.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <button className='btn' onClick={handleClose}>CLOSE</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
