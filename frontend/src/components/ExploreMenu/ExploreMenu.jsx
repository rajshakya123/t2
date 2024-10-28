import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({category,setCategory}) => {
  return (
    <div className='explore-menu' id='explore-menu'>
        <h1 className='h1e'>Explore Our Variety of Desi Ghee Options by Quantity!</h1>
        <p className='explore-menu-text'>Choose from a variety of premium Desi Ghee options, available in different quantities to suit your needs</p>
        <div className="explore-menu-list">
            {menu_list.map((item, index)=>{
                return (
                    <div onClick={()=>setCategory(prev=>prev===item.menu_name?"All":item.menu_name)} key={index} className='explore-menu-list-item'>
                        <img className={category===item.menu_name?"active":""} src={item.menu_image} alt="" />
                        <p className='item_menu'>{item.menu_name}</p>
                    </div>
                )
            })}
        </div>
        <hr />
    </div>
  )
}

export default ExploreMenu