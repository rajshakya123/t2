import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../components/payment/Payment.css';
import axios from 'axios';

const Payment = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState('');
  const location = useLocation();  
  const { items, subtotal, deliveryFee, total } = location.state;
  console.log(items);

  const handlePaymentOptionChange = (option) => {
    setSelectedPayment(option);
  };

  const handlePayment = () => {
    if (selectedPayment === 'qropay') {
      const orderType = "online"; // Replace with your actual order type

    // Navigate to the order page with the order type as a query parameter
    navigate(`/order?orderType=₹{orderType}`);
    }else if (selectedPayment === 'Google Pay') {
      window.open('upi://pay?pa=merchant@bank&pn=Merchant&tn=Payment&am=1500&cu=INR', '_blank');
    } else if (selectedPayment === 'PhonePe') {
      window.open('upi://pay?pa=merchant@phonepe&pn=Merchant&tn=Payment&am=1500&cu=INR', '_blank');
    } else if (selectedPayment === 'Cash on Delivery') {
      const orderType = "offline"; // Replace with your actual order type

      // Navigate to the order page with the order type as a query parameter
      navigate(`/order?orderType=₹{orderType}`);    
    } else {
    }
  };

  return (
    <div className="payment-container">
      {/* Payment options */}
      <div className="payment-method">
        <h1>Choose Payment Option:</h1>
        <ul className='ul-radio-btn'>
          <li>
            <input
              type="radio"
              name="payment"
              value="Cash on Delivery"
              onChange={() => handlePaymentOptionChange('Cash on Delivery')}
            />
            Cash on Delivery
          </li>
        </ul>
        <button onClick={handlePayment} style={{ marginTop: '1rem', padding: '0.5rem 1rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Proceed to Payment
        </button>
      </div>

      {/* Product details */}
      <div className="payment-description" style={{ flex: 1, border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
        <h1>Product Details</h1>
        {items.map((item, index) => (
          <div key={index}>
            <p><strong>Product Name:</strong> {item.name}</p>
            <p><strong>Price:</strong> ₹{item.price}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Total:</strong> ₹{item.total}</p>
            <hr />
          </div>
        ))}
        <p><strong>Subtotal:</strong> ₹{subtotal}</p>
        <p><strong>Delivery Fee:</strong> ₹{deliveryFee}</p>
        <p><strong>Total:</strong> ₹{total}</p>
      </div>
    </div>
  );
};

export default Payment;
