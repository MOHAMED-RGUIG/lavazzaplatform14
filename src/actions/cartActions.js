export const addToCart = (product, quantity, isChecked) => (dispatch ,getState)=>{
  var cartItem = {
      Nom : product.Nom,
      _id : product._id,
      Image : product.Image,

      quantity : Number(quantity),
      Montant_TTC: product.Montant_TTC,
      price: isChecked ? 0 : product.Montant_TTC * quantity,
      isChecked: isChecked}
  
  
      if(cartItem.quantity<1){
          alert("You cannot choose less than 1 quantity ")
      }else{
          dispatch({type: 'ADD_TO_CART', payload: cartItem})
          
  
      }
  
  
  const cartItems = getState().cartReducer.cartItems
  localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }
  
  export const deleteFromCart=(product)=>(dispatch,getState)=>{
          dispatch({type:'DELETE_FROM_CART',payload:product})
          const cartItems = getState().cartReducer.cartItems
  
          localStorage.setItem('cartItems', JSON.stringify(cartItems))
   
  }
  