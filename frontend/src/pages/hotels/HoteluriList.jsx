import React, { useContext, useEffect } from 'react'
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
const HoteluriList = ({hotel,favoriteHotels,setFavoriteHotels}) => {
  const navigate = useNavigate();
  const {user}=useContext(UserContext);
  
  
  const toggleFavorite = async()=>{


    const res = await fetch(
    `${import.meta.env.VITE_API_URL}/users/favorite-hotel/toggle`,
    {
      method:"POST",
      headers:{
      "Content-Type":"application/json"
      },
      body:JSON.stringify({

      user_id:user.id,
      hotel_id:hotel.id

      })
    }
    );


    const data=await res.json();



    if(data.favorit){


      setFavoriteHotels([
      ...favoriteHotels,
      hotel.id
    ]);


    }else{


      setFavoriteHotels(
      favoriteHotels.filter(
      (id)=>id!==hotel.id
      )
    );


  }



  }

  
  return (
    <li key={hotel.id}  className='flex max-modf1:flex-col space-x-3 modf1:items-center  max-modf1:relative pb-8 border-b-button/30 border-b'>
      <div className=' w-55 max-modf1:w-full max-modf1:h-60 h-44 max-modf:w-45 overflow-hidden rounded-lg group relative'>
        <img onClick={()=>navigate(`/hotels/${hotel.slug}`)} src={`${import.meta.env.BASE_URL}${hotel.img}`} className=' cursor-pointer w-full h-full   object-center  group-hover:scale-110 transition-transform duration-300 ease-in-out' alt="" />
        <button onClick={toggleFavorite}
        className='cursor-pointer absolute top-3 right-3 bg-button1/80 rounded-full px-1.5 py-1.5'
        >


          {

          favoriteHotels.includes(hotel.id)

          ?

          <FaHeart 
          size={19}
          className="text-red-600"
          />


          :

          <FaRegHeart
          size={19}
          />


          }


        </button>
        
      </div>

      <div className='h-full flex-2 modf1:border-r modf1:border-r-button/40 max-modf1:mt-2  max-modf1:pb-3 max-modf1:w-full'>

        <div>
          <p onClick={()=>navigate(`/hotels/${hotel.slug}`)} className=' cursor-pointer font-medium text-[20px]'>{hotel.nume}</p>
          <p className='text-gray-400'>{hotel.locatie}</p>
        </div>


        <div className='mt-2 flex space-x-3 items-center'>
          <div className=''>
            <p className='bg-button/20 px-3 py-3 rounded-lg'>{hotel.rating_hotel}</p>
          </div>
          
          <div>
            <div className='flex space-x-1'>
              {
                [1,2,3,4,5].map(star=>(
                  <FaStar className={star<=Math.round(hotel.rating_hotel)? "text-yellow-400": "text-gray-400"}/>
                ))
              }
            </div>
            <div>
              <p className='mt-1 text-gray-400'>{hotel.total_recenzii} recenzii</p>
            </div>
          </div>

          
        </div>

        <div className='text-gray-400 flex space-x-3 mt-2'>
          <p>{hotel.facilitate}</p>
          <p>{hotel.facilitate1}</p>
        </div>

        <div>
          <p className='text-green-500'>{hotel.anulare_gratuita}</p>
          <p className='text-gray-400'>{hotel.data_anulare}</p>
        </div>

      </div>



      <div className='  flex-1 '>
        <div>
          <button onClick={()=>navigate(`/hotels/${hotel.slug}`)} className='bg-button w-full py-1.5 cursor-pointer rounded-xl mt-3'>Vezi detalii</button>
        </div>
      </div>
    </li>
  )
}

export default HoteluriList
