import React, { useEffect, useState } from 'react'
import './PlaceOrder.css'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

  const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const orderType = queryParams.get('orderType');
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext)

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }


  const offlineOrder = async() =>{
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo)
      }
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    }
    let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } })
    if (response.data.success ) {
      const session_url = response.data.session_url;

      window.location.replace(session_url);
    }else {
      alert(res.msg);
    }
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo)
      }
    })
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    }
    let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } })
    if (response.data.success ) {
      const session_url = response.data.session_url;
      const options = {
        key: response.data.key_id,
        amount: response.data.amount,
        currency: "INR",
        name: response.data.product_name,
        description: response.data.description,
        image: "https://dummyimage.com/600x400/000/fff",
        order_id: response.data.order_id,
        handler: function (response) {
          window.location.replace(session_url);
        },
        prefill: {
          contact: response.data.contact,
          name: response.data.name,
          email: response.data.email,
        },
        notes: {
          description: response.data.description,
        },
        theme: {
          color: "#2300a3",
        },
      };
      const razorpayObject = new window.Razorpay(options);
      razorpayObject.on("payment.failed", function (response) {
        alert("Payment Failed");
      });
      razorpayObject.open();
    } else {
      alert(res.msg);
    }
  }

  const navigate = useNavigate();


  useEffect(() => {
    if (!token) {
      navigate('/cart')
    }
    else if (getTotalCartAmount() === 0) {
      navigate('/cart')
    }
  }, [token])


  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input className='emaill' required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input className='streett' required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input className='phonee' required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          {orderType === 'online' ? (
            <button type='submit'>PROCEED TO PAYMENT</button>
          ) : (
            <button type='button' onClick={offlineOrder} disabled={getTotalCartAmount() === 0}>
              Place Order (Proceed to Confirmation)
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder