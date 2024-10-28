import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Success.css'; // Import the custom CSS

const Success = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Navigate to home page
  };

  return (
    <div className="order-success-container">
      <h1>Order Placed Successfully!</h1>
      <p>Thank you for your purchase.</p>
      <button 
        onClick={handleGoHome} 
        className="order-success-button"
      >
        Go To Home
      </button>
    </div>
  );
};

export default Success;
