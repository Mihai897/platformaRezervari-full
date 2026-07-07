import React, { useContext } from 'react'
import HoteluriList from './HoteluriList'

import { useState } from 'react'
import { useEffect } from 'react'
import { UserContext } from '../../context/UserContext'
const Hoteluri = ({hotels}) => {
  const {user}=useContext(UserContext);
   const [favoriteHotels,setFavoriteHotels]=useState([]);
  useEffect(()=>{
      if(!user?.id)return;
      fetch(`${import.meta.env.VITE_API_URL}/users/favorite-hotel/${user.id}`)
      .then(res=>res.json())
      .then(data=>{
        setFavoriteHotels(
          data.map(item=>item.hotel_id)
        );
      })
    },[user])
  return (
    <ul className='space-y-8 mt-4'>
      {
        hotels.map((component)=>(
          <HoteluriList hotel={component} favoriteHotels={favoriteHotels}
          setFavoriteHotels={setFavoriteHotels}/>
        ))
      }
      
    </ul>
  )
}

export default Hoteluri
