import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, deleteFromCart } from '../actions/cartActions';
import Checkout from '../components/Checkout';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Cartscreen() {
    const cartstate = useSelector(state => state.cartReducer);
    const cartItems = cartstate.cartItems;
    const subtotal = cartItems.reduce((x, item) => x + item.price, 0);
    const [modalitePai, setModalitePai] = useState('');
    const [codeClient, setcodeClient] = useState('');

    const [dateCmd, setdateCmd] = useState('');
 const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const dispatch = useDispatch();
    const handleCheckout = () => {
        // Perform checkout logic
        const orderGroup = {
            items: cartItems.map(item => ({
                QTY: item.quantity,
                NETPRI: item.Montant_TTC,
                TOTLIN: item.price ,
                ITMDES: item.Nom,
                GRAT: item.isChecked ? 1 : 0 // Assuming isChecked indicates if the item is free
            })),
            orderInfo: {
                ORDDAT: dateCmd,
                BPCORD: codeClient
            }
        };
        generateOrderPDF(orderGroup);
    };

    const generateOrderPDF = (orderGroup) => {
        const doc = new jsPDF();
        const logoImg = new Image();
        logoImg.src = '../logo.jpg'; // Ensure the path is correct

        // Calculate total price and quantity
        const totalQuantity = orderGroup.items.reduce((total, item) => total + item.QTY, 0);
        const totalP = orderGroup.items.reduce((total, item) => total + item.NETPRI, 0);
        const totalPrice = orderGroup.items.reduce((total, item) => total + item.TOTLIN, 0);

        logoImg.onload = () => {
            doc.addImage(logoImg, 'JPG', 25, 15, 30, 20); // x, y, width, height
            doc.setFontSize(15);
            doc.setFont("helvetica", "bold");
            doc.setTextColor('#003f7e');
            doc.text(`TOP CLASS ESPRESSO`, 120, 20);
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
        
            doc.text(`E :` + currentUser.EMAILUSR, 120, 35);
            doc.text(`P:   ` + currentUser.TELEP, 120, 40);
            doc.text(`DETAIL COMMANDE`, 15, 55);

            const columns = ["", ""];
            const rows = [
                ["Collaborateur :", currentUser.NOMUSR],
                ["Date :", orderGroup.orderInfo.ORDDAT],
                ["Client Code :", orderGroup.orderInfo.BPCORD],
            ];

            doc.autoTable({
                startY: 60,
                head: [columns],
                body: rows,
                theme: 'plain',
                styles: { cellPadding: 1, fontSize: 10 },
                columnStyles: {
                    0: { cellWidth: 40 },
                    1: { cellWidth: 100 }
                }
            });
            doc.setFontSize(25); // Set font size
            doc.setFont("helvetica", "bold"); // Set font to Helvetica and make it bold
            doc.setTextColor('#003f7e'); // Set text color to blue (RGB format)
            doc.text(`BON DE COMMANDE`, 55, 100);

            const tableColumns = ['Name', 'Gratuit','Quantity', 'PriceU','Total TTC'];
            const tableRows = orderGroup.items.map(item => [item.ITMDES,item.GRAT == 1 ? 'Oui' : 'Non', item.QTY, `${item.NETPRI} DH`,`${item.TOTLIN} DH`]);

            doc.autoTable({
                startY: 110,
                head: [tableColumns],
                styles: { cellPadding: 1, fontSize: 10 },
                body: tableRows,
                foot: [[ '', 'Total', totalQuantity, `-`, `${totalPrice} DH`]],
                headStyles: { fillColor: '#063970' },  // Light grey background
                footStyles: { fillColor: '#063970' },
                didDrawPage: function (data) {
                    // Calculate the position for the custom text
                    let pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
                    let textY = data.cursor.y + 35; // Add 10 units below the table
                    let textX = data.settings.margin.left + 30;
                    // Add custom text after the table foot
                    doc.setFontSize(15); 
                    doc.setFont("helvetica", "bold"); // Set font to Helvetica and make it bold
                    doc.setTextColor('#000000'); // Set text color to blue (RGB format)
                    doc.text("VISA", textX, textY);
                }
            });

            doc.save(`order_${orderGroup.orderInfo.ORDDAT}.pdf`);
            alert('Your order PDF is exported!');
        };
    };

    return (
        <div className='container col-xl-12 col-md-12 col-12'>
            <div className='justify-content-center col-12 col-md-12'>
                <div className='col-md-12 col-12'>
                    <h2 style={{ fontSize: '35px' }} className='mx-auto col-md-12 col-12 mt-3 mb-5'>My Cart</h2>
                    <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Total price : {subtotal} DH</h2>
                    <hr />
                    {cartItems.map(item => (
                        <div className='flex-container col-12 col-md-12 mx-auto mb-2 ' key={item.id}>
                            <hr />
                            <div className='mx-2 '>
                                <img src={item.Image} alt='item' style={{ height: '120px', width: '140px', backgroundColor: '#f3f3f3', borderRadius: '3px' }} />
                            </div>
                            <div className='text-start w-50 pt-1'>
                                <h3 style={{ display: 'inline', fontSize: '13px' }}>{item.Nom}</h3><br />
                                <h2 style={{ display: 'inline', fontSize: '16px' }}>{item.price} DH</h2><br />
                                <i className="fa-solid fa-minus" style={{ fontSize: '15px' }} aria-hidden='true' onClick={() => { dispatch(addToCart(item, item.quantity - 1, item.isChecked)) }}></i>
                                <b style={{ fontSize: '15px', padding: '5px 0px' }} className="px-2">{item.quantity}</b>
                                <i className="fa-solid fa-plus" style={{ fontSize: '15px' }} aria-hidden='true' onClick={() => { dispatch(addToCart(item, item.quantity + 1, item.isChecked)) }}></i>
                            </div>
                            <div className=''>
                                <i className="fa fa-trash mt-5 pt-4" style={{ fontSize: '15px' }} aria-hidden='true' onClick={() => { dispatch(deleteFromCart(item)) }}>
                                    <span style={{ fontSize: '9px', paddingLeft: '4px' }}>Remove</span>
                                </i>
                            </div>
                            <hr />
                        </div>
                    ))}
                </div>
            </div>
            <div className='col-md-12 text-center col-12 mx-auto bg-white'>
                <hr />
                <h2 style={{ fontSize: '25px' }}>Client info </h2>
                <div className="text-start w-100 col-xl-12">
                    <input required type='text' placeholder='Code Client' className='form-control'
                        value={codeClient} onChange={(e) => { setcodeClient(e.target.value) }} />
                 
            <select
                required
                id="modalitePai"
                className='form-control'
                value={modalitePai}
                onChange={(e) => { setModalitePai(e.target.value) }}
            >
                <option value="" disabled>Choisissez une modalité de paiement</option>
                <option value="espèce">Espèce</option>
                <option value="chèque">Chèque</option>
                <option value="virement">Virement</option>
            </select>
                    <input required type='date' placeholder='Adresse' className='form-control'
                        value={dateCmd} onChange={(e) => { setdateCmd(e.target.value) }} />
                </div>
            </div>
            <div className='col-md-12 mt-2 text-center col-12'>
                <Checkout subtotal={subtotal} codeClient={codeClient} modalitePai={modalitePai} dateCmd={dateCmd} handleCheckout={handleCheckout}/>
            </div>
        </div>
    );
}

export default Cartscreen;
