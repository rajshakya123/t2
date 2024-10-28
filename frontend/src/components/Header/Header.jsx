import React from 'react'
import './Header.css'

import headerImg from '../../assets/ghee.png'

const Header = () => {
  return (
    <div className='header'>
        <div className="header-contents">
          <div className="header-img">
            <img src={headerImg} alt="header-img" />
          </div>
          <div className="header-text">
            <h2>Gaon ki khushboo aur asli swad, ab aapke ghar! Hamara fresh desi ghee, gaon ki parampara se bana. Sirf ek call ya WhatsApp karein, aur is swad ka anand uthayein: 9568513893</h2>
            <p className="headerParaText">Our Desi Ghee is made from fresh milk, traditionally prepared and stored in earthen pots in the village. We deliver this pure, unadulterated ghee straight to your city, so you can enjoy the rich flavor and authenticity in every bite!</p>
            <a href="#explore-menu"><button className='buttonwl'>View Menu</button></a>
          </div>
        </div>
    </div>
  )
}

export default Header