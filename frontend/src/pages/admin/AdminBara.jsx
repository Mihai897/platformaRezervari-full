import React from 'react'
import { IoMenu } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';

const AdminBara = ({visibleBara,setVisibileBara}) => {
  const { user, setUser } = useContext(UserContext);
  return (
    <div className={`fixed top-0 ${visibleBara? "left-46.5 modf5:left-50 modf5:mr-3 ":"left-0 " } z-100 pl-3 pr-6 bg-background  border-b border-button/30 transition-all duration-300 ease-in-out py-4 
    right-0 `}>
      <div className='flex justify-between space-x-3 items-center max-w-screen-2xl mx-auto'>
        <button className='  cursor-pointer z-100' onClick={()=>setVisibileBara(!visibleBara)}>
          <IoMenu className='text-[19px]'/>
        </button>

        <div className='flex items-center space-x-8'>
          
          <div className='flex items-center space-x-3 text-[14px]'>
            <div className='w-10 h-10 rounded-full'>
              <img className='rounded-full w-full h-full' src={user.poza_profil?.startsWith("http")
                    ? user.poza_profil
                    : `${import.meta.env.BASE_URL}${user.poza_profil}`} alt="" />
            </div>
            <div>
              <p>{user.nume} {user.prenume}</p>
              <p className='text-gray-400'>{user.rol}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminBara
