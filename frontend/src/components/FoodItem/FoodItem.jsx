import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

function FoodItem({ id, name, price, description, image }) {
  const navigate = useNavigate();
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  const handleAddClick = () => {
    addToCart(id);
  };

  // Handler for navigating to the cart after adding the item
  const handleBuyClick = () => {
    console.log("Buy button clicked");
    addToCart(id); // Add item to cart first
    navigate('/cart'); // Then navigate to the cart
  };

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={url + "/images/" + image} alt="" />
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p className='namewe'>{name}</p>
          <img className='ratingstars' src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
      </div>
      <div className="food-item-bottom">
        <p className="food-item-price">₹{price.toFixed(2)}</p>
        <div className="food-item-actions">
          {/* Show Add button if item is not in the cart */}
          {!cartItems[id] ? (
            <button className="toggle-button add" onClick={handleAddClick}>
              Add
            </button>
          ) : (
            <div className="food-item-counter">
              <img 
                onClick={() => removeFromCart(id)} 
                src={assets.remove_icon_red} 
                alt="Remove item from cart" 
              />
              <p className="cartitemsp">{cartItems[id]}</p>
              <img 
                onClick={handleAddClick} 
                src={assets.add_icon_green} 
                alt="Add item to cart" 
              />
            </div>
          )}
          {/* Buy button */}
          <button 
            className="toggle-button buy" 
            onClick={handleBuyClick} 
          >
            Buy
          </button>
        </div>
      </div>
    </div>
  );
}

export default FoodItem;
