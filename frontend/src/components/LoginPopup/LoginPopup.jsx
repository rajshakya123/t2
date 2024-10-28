import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  
  const [currState, setCurrState] = useState('Login'); // Login, Sign Up, Forgot Password, OTP Verification, Set New Password
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    otp: '', // To store the OTP input
    newPassword: '' // To store new password after OTP verification
  });

  const [passwordVisible, setPasswordVisible] = useState(false); // State to handle password visibility
  const [newPasswordVisible, setNewPasswordVisible] = useState(false); // Separate state for new password visibility

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible); // Toggle password visibility state for login/signup
  };

  const toggleNewPasswordVisibility = () => {
    setNewPasswordVisible(!newPasswordVisible); // Toggle new password visibility state
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    let newUrl = url;

    if (currState === 'Forgot Password') {
      newUrl += '/api/user/forgot-password'; // API to send OTP via email
    } else if (currState === 'OTP Verification') {
      newUrl += '/api/user/verify-otp'; // API to verify OTP
    } else if (currState === 'Set New Password') {
      newUrl += '/api/user/set-new-password'; // API to set new password after OTP verification
    } else if (currState === 'Login') {
      newUrl += '/api/user/login';
    } else {
      newUrl += '/api/user/register';
    }

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        if (currState === 'Forgot Password') {
          alert('OTP sent to your email. Please check your inbox.');
          setCurrState('OTP Verification');
        } else if (currState === 'OTP Verification') {
          alert('OTP verified! You can now set a new password.');
          setCurrState('Set New Password');
        } else if (currState === 'Set New Password') {
          alert('Password updated successfully! Please log in.');
          setCurrState('Login');
        } else {
          const token = response.data.token;
          setToken(token);
          localStorage.setItem('token', token);
          setShowLogin(false); // Close login popup
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onSubmit} className="login-popup-container">
        <div className="login-popup-title">
          <h2>
            {currState === 'Forgot Password'
              ? 'Reset Password'
              : currState === 'OTP Verification'
              ? 'Verify OTP'
              : currState === 'Set New Password'
              ? 'Set New Password'
              : currState}
          </h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="close icon" />
        </div>

        <div className="login-popup-inputs">
          {currState === 'Sign Up' && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />

          {currState !== 'Forgot Password' &&
            currState !== 'OTP Verification' &&
            currState !== 'Set New Password' && (
              <div className="password-field">
                <input
                  name="password"
                  onChange={onChangeHandler}
                  value={data.password}
                  type={passwordVisible ? 'text' : 'password'} // Conditional type based on visibility
                  placeholder="Password"
                  required
                />
                <button type="button" onClick={togglePasswordVisibility}>
                  {passwordVisible ? 'Hide' : 'Show'} {/* Toggle button text */}
                </button>
              </div>
            )}

          {currState === 'OTP Verification' && (
            <input
              name="otp"
              onChange={onChangeHandler}
              value={data.otp}
              type="text"
              placeholder="Enter OTP"
              required
            />
          )}

          {currState === 'Set New Password' && (
            <div className="password-field">
              <input
                name="newPassword"
                onChange={onChangeHandler}
                value={data.newPassword}
                type={newPasswordVisible ? 'text' : 'password'} // Conditional type based on new password visibility
                placeholder="New Password"
                required
              />
              <button type="button" onClick={toggleNewPasswordVisibility}>
                {newPasswordVisible ? 'Hide' : 'Show'} {/* Toggle button text */}
              </button>
            </div>
          )}
        </div>

        <button type="submit">
          {currState === 'Forgot Password'
            ? 'Send OTP'
            : currState === 'OTP Verification'
            ? 'Verify OTP'
            : currState === 'Set New Password'
            ? 'Set Password'
            : currState === 'Sign Up'
            ? 'Create account'
            : 'Login'}
        </button>

        {currState === 'Login' && (
          <p className="forgot-password-link">
            <span onClick={() => setCurrState('Forgot Password')}>Forgot your password?</span>
          </p>
        )}

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p className="continuee">
            By continuing, I agree to the terms of use & privacy policy
          </p>
        </div>

        {currState === 'Login' ? (
          <p>
            Create a new account?{' '}
            <span onClick={() => setCurrState('Sign Up')}>Click here</span>
          </p>
        ) : currState === 'Sign Up' ? (
          <p>
            Already have an account?{' '}
            <span onClick={() => setCurrState('Login')}>Login here</span>
          </p>
        ) : (
          <p>
            Remembered your password?{' '}
            <span onClick={() => setCurrState('Login')}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
