import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { getUserOrders } from '../actions/orderActions';

const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }

  return [month, day, year].join('/');
};

const CartDetailsScreen = () => {
  const dispatch = useDispatch();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const orderState = useSelector(state => state.getUserOrdersReducer);
  const { orders, error, loading } = orderState;

  const [productName, setProductName] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [clientCode, setClientCode] = useState('');

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleOrderDateChange = (e) => {
    setOrderDate(e.target.value);
  };

  const handleClientCodeChange = (e) => {
    setClientCode(e.target.value);
  };

  const filterOrders = () => {
    return orders.filter(order => {
      const orderDateStr = order.ORDDAT.slice(0, 10); // Extract the date part in YYYY-MM-DD format
      return order.ITMDES.toLowerCase().includes(productName.toLowerCase()) &&
             (orderDate ? orderDateStr === orderDate : true) &&
             (order.BPCORD ? order.BPCORD.toLowerCase().includes(clientCode.toLowerCase()) : true);
    });
  };

  const groupOrdersByNumber = (orders) => {
    const groupedOrders = {};
    orders.forEach(order => {
      if (!groupedOrders[order.SOHNUM]) {
        groupedOrders[order.SOHNUM] = {
          orderInfo: order,
          items: []
        };
      }
      groupedOrders[order.SOHNUM].items.push(order);
    });
    return Object.values(groupedOrders);
  };

  const calculateTotalTOTLIN = (groupedOrders) => {
    return groupedOrders.reduce((total, group) => total + group.orderInfo.TOTLIN, 0);
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
        ["Date :", formatDate(orderGroup.orderInfo.ORDDAT)], // Use formatted date here
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
        foot: [[ '','Total' ,totalQuantity,`-` ,`${totalPrice} DH`]],
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
          doc.setTextColor('#00000'); // Set text color to blue (RGB format)
          doc.text("VISA", textX, textY);
      }
      });



      doc.save(`order_${formatDate(orderGroup.orderInfo.ORDDAT)}.pdf`);
      toast.success('Your order PDF is exported!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false
      });
    };
  };

  /*const generateGlobalPDF = () => {
    const doc = new jsPDF();
    const logoImg = new Image();
    logoImg.src = '../logo.jpg'; // Ensure the path is correct

    logoImg.onload = () => {
      doc.addImage(logoImg, 'JPG', 25, 15, 30, 20); // x, y, width, height
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      doc.setTextColor('#003f7e');
      doc.text(`TOP CLASS ESPRESSO`, 120, 20);
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(`E :   ` + currentUser.EMAILUSR, 120, 35);
      doc.text(`P:   ` + currentUser.TELEP, 120, 40);
      
     
 
      doc.text(`DETAIL COMMANDE`, 15, 55);

      const columns = ["", ""];
      const rows = [
        ["Collaborateur :", currentUser.NOMUSR],
  
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
      doc.text(`BON DE COMMANDE GLOBALE`, 40, 100);
     

      const tableColumns = ['Order ID', 'Client', 'Item Name',  'Quantity', 'Price (DH)','Total TTC'];
      const globalTableRows = [];

      const filteredOrders = groupOrdersByNumber(filterOrders()); // Group orders by number

      filteredOrders.forEach(group => {
        group.items.forEach((item, index) => {
   
          globalTableRows.push([index === 0 ? group.orderInfo.SOHNUM : '', index === 0 ? group.orderInfo.BPCORD : '',item.ITMDES , item.QTY,`${item.NETPRI} DH`, `${item.TOTLIN} DH`]);
         
        });
      });

      const totalPrice = filteredOrders.reduce((acc, group) => acc + group.items.reduce((subAcc, item) => subAcc + item.NETPRI, 0), 0);
      const totalQuantity = filteredOrders.reduce((acc, group) => acc + group.items.reduce((subAcc, item) => subAcc + item.QTY, 0), 0);
      const totalTTC = filteredOrders.reduce((acc, group) => acc + group.items.reduce((subAcc, item) => subAcc + item.TOTLIN, 0), 0);
      doc.autoTable({
        startY: 110,
        head: [tableColumns],
        body: globalTableRows,
        foot: [['','',  'Total' ,totalQuantity,`${totalPrice} DH` ,`${totalTTC} DH`]],
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
          doc.setTextColor('#00000'); // Set text color to blue (RGB format)
          doc.text("VISA", textX, textY);
      }
      });

 
      doc.save('global_order_details.pdf');
      toast.success('Your global order PDF is exported!', {
        position: 'bottom-right',
        autoClose: 3000,
        hideProgressBar: false
      });
    };
  };*/

  const groupedOrders = groupOrdersByNumber(filterOrders());
  const totalTOTLIN = calculateTotalTOTLIN(groupedOrders);

  return (
    <div className="container justify-content-center col-12 col-xl-12 col-md-12 mt-5 mx-auto">
      <div className="mb-4 pb-3">
        <h2>My Orders</h2>
        <h6>User: {currentUser ? currentUser.EMAILUSR : 'Guest'}</h6>
        <h2>Total price: {totalTOTLIN} DH</h2>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by product name"
          value={productName}
          onChange={handleProductNameChange}
          className="form-control shadow-lg bg-body rounded"
        />
        <input
          type="date"
          value={orderDate}
          onChange={handleOrderDateChange}
          className="form-control mt-3 shadow-lg bg-body rounded"
        />
        <input
          type="text"
          placeholder="Search by client code"
          value={clientCode}
          onChange={handleClientCodeChange}
          className="form-control mt-3 shadow-lg bg-body rounded"
        />
      </div>
      {loading && <Loading />}
      {error && <Error error="Something went wrong" />}
      {orders && (
        <>
          {groupedOrders.map(group => (
            <div className="cart-items col-12 col-md-12 mt-5" key={group.orderInfo.SOHNUM}>
              <hr className="mx-auto col-1 col-xl-12 col-lg-12" style={{ width: '300px' }} />
              <h3 className="pt-1 mx-auto" style={{ color: '#800000' }}>Order N° {group.orderInfo.SOHNUM}</h3>
              <div className="col-xl-12 mb-5 mx-auto">
        
                <button
                  onClick={() => generateOrderPDF(group)}
                  className="btn btn-primary"
                  type="button" style={{ fontSize: '20px', border: '0px' }}
                >
                  Cette commande en &nbsp;
                  <i className="fa fa-file-pdf-o"></i>
                </button>
              </div>
              <p className="card-text text-start" style={{ fontSize: '12px' }}>Code: {group.orderInfo.BPCORD}</p>
              <p className="card-text text-start" style={{ fontSize: '12px' }}>Date de commande: {formatDate(group.orderInfo.ORDDAT)}</p> {/* Use formatted date here */}
              {group.items.map(item => (
                <div className='' key={item.ID}>
                  <div style={{ border: 'none' }} className="card mb-3">
                    <div className="g-0 flex-container col-12 col-md-12">
                      <div className="col-md-5">
                      </div>
                      <div className="col-12 col-md-12">
                        <div className="card-body col-12 col-md-12">
                          <h4 className="card-title">{item.ITMDES}</h4>
                          <p className="card-text" style={{ fontSize: '11px' }}>Quantity: {item.QTY}</p>
                          <p className="card-text" style={{ fontSize: '11px' }}>Date Creation: {formatDate(item.CREDAT)}</p> {/* Use formatted date here */}
                          <p className="card-text" style={{ fontSize: '11px' }}>Price: {item.NETPRI} DH</p>
                        </div>
                      </div>
                    </div>
                    <div className="container">
                      <div className="row">
                        <hr className="mx-auto col-1 col-xl-12 col-lg-12" style={{ width: '300px' }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </>
      )}
      {/*<button onClick={generateGlobalPDF} style={{ fontSize: '25px', border: '0px' }} className="btn btn-primary mt-2" type="button">
        All commandes en &nbsp;
        <i className="fa fa-file-pdf-o"></i>
    </button>*/}
    </div>
  );
};

export default CartDetailsScreen;
