import React, { useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { RiArrowRightSLine } from 'react-icons/ri'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import hotels from '../hotels/Hotel/hotels'
import rezervare from '../admin/rezervare'
import { useEffect } from 'react';

const AdminAdaugaRezervare = () => {
  const {slug} = useParams();
  const [rezervariUsers,setRezervariUsers] = useState([]);
  const [hotelss,setHotelss] = useState([]);
  const [camereSlug, setCamereSlug] = useState([]);
    useEffect(()=>{
      fetch(`${import.meta.env.VITE_API_URL}/rooms/rosetti-hotel`)
      .then(res=>res.json())
      .then(data=>setCamereSlug(data))
      .catch(err=>console.error(err))
    },[slug])
  useEffect(()=>{
    fetch(`${import.meta.env.VITE_API_URL}/hotels`)
    .then(res=>res.json())
    .then(data=>setHotelss(data))
    .catch(err=>console.error(err))
  },[])
  useEffect(()=>{
    fetch(`${import.meta.env.VITE_API_URL}/users/rezervari`)
    .then(res=>res.json())
    .then(data=>setRezervariUsers(data))
    .catch(err=>console.error(err))
  },[])

  const [hotelSlugSelectat,setHotelSlugSelectat] = useState('');
  const [hotelSelectat,setHotelSelectat] = useState(null);
  const [camerele,setCamerele] = useState([]);

  const [cameraSelectata,setCameraSelectata] = useState(null);
  const [tarifSelectat,setTarifSelectat] = useState(null);


  const [rezervarre,setRezervarre] = useState({
    nume: "",
    prenume: "",
    email: "",
    telefon: "",

    tara: "",
    hotel_id: null,
    room_id: null,
    tarif_id: null,
    check_in: "",
    check_out: "",
    nr_adulti:1,
    nr_copii:0,
    nr_sugari:0,
    notite_client:""
  })

  

 useEffect(()=>{
    fetch(`${import.meta.env.VITE_API_URL}/rooms/${hotelSlugSelectat}`)
    .then(res=>res.json())
    .then(data=>setCamerele(data))
    .catch(err=>console.error(err))
  },[hotelSlugSelectat])

  const checkIn = new Date(rezervarre.check_in) ;
  const checkOut = new Date(rezervarre.check_out);
  const numar_nopti = Math.ceil(
    (checkOut - checkIn) / (1000 * 60 * 60 * 24)
    ) || 0;




  const creeazaRezervare = async()=>{
    try{
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/rezervari/admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body:JSON.stringify(rezervarre)
        }
      );
      const data = await response.json();
      if(response.ok){
        alert(data.mesaj);
        navigate("/admin/admin-rezervari");

      }
      else{
        alert(data.mesaj);
      }
    }
    catch(error){
      console.log(error);
      alert("A aparut o eroare.");
    }
  }

  const {visibleBara} = useOutletContext();
  const navigate = useNavigate();
  const [visibleNrTelList,setVisibleNrTelList] = useState(false);
  const [visibleTaraList,setVisibleTaraList] = useState(false);
  const [visibleHotelList,setVisibleHotelList] = useState(false);
  const [visibleCameraList,setVisibleCameraList] = useState(false);
  const [text,setText] = useState("");

  const [visibleTarifeRez,setVisibleTarifeRez] = useState(false);
  let reducere = 0;
  let taxe = 30;
  return (
    <div>
      

      <div className='flex items-center space-x-3 text-gray-400'>
        <Link to={"/admin/admin-angajati"} className='hover:text-white text-gray-400 transition-all duration-300 ease-in-out'>Rezervari</Link>
        <RiArrowRightSLine className='text-[18px] mt-0.5'/>
        <p className='text-button'>Rezervare noua</p>
      </div>
      <div>
        <p className='mt-3 text-[18px] font-medium'>Adauga rezervare noua</p>
        <p className='text-gray-400'>Completeaza infomratiile pentru a crea o rezervare noua.</p>
      </div>

      <div className='border border-button/30  py-3 mt-3 rounded-lg'>

        <div className={`grid ${visibleBara?"max-modf4:grid-cols-1":"max-modf:grid-cols-1"} grid-cols-2 px-3 gap-3 pb-3 border-b-button/30 border-b`}>


          <div>
            <p className='font-medium'>Informatii client</p>
            <div className='text-gray-400'>
              <p className='mt-2'>Nume <span className='text-red-600'>*</span></p>
              <input value={rezervarre.nume}
              onChange={(e)=>setRezervarre({
                ...rezervarre,
                nume:e.target.value
              })}
              className='border w-full border-button/30 px-3 rounded-sm outline-0 text-white py-2 mt-2' type="text" placeholder='Ex: Popa' name="" id="" />
            </div>
            <div className='text-gray-400'>
              <p className='mt-2'>Prenume <span className='text-red-600'>*</span></p>
              <input value={rezervarre.prenume}
              onChange={e=>setRezervarre({
                ...rezervarre,
                prenume:e.target.value
              })}
              className='border w-full border-button/30 px-3 rounded-sm outline-0 text-white py-2 mt-2' type="text" placeholder='Ex: Maria' name="" id="" />
            </div>
            <div className='text-gray-400'>
              <p className='mt-2'>Email <span className='text-red-600'>*</span></p>
              <input value={rezervarre.email}
              onChange={e=>setRezervarre({
                ...rezervarre,
                email:e.target.value
              })}
              className='border w-full border-button/30 px-3 rounded-sm outline-0 text-white py-2 mt-2' type="email" placeholder='Ex: maria.popa@email.com' name="" id="" />
            </div>

            <div className='text-gray-400'>
              <p className='mt-2'>Telefon <span className='text-red-600'>*</span></p>
              <div className='flex items-center space-x-3 mt-2'>
                <div className='relative'>
                  <button onClick={()=>{setVisibleNrTelList(!visibleNrTelList)}} className={`flex items-center space-x-3 border border-button/30 px-1.5 py-2 hover:bg-button/30 cursor-pointer transition-all duration-300 ease-in-out ${visibleNrTelList?"bg-button/30 rounded-t-sm":"bg-background rounded-sm"}`}>
                    <p>+40</p>
                    {visibleNrTelList? <IoIosArrowUp />:<IoIosArrowDown />}
                  </button>
                  <ul className={`absolute z-30 transition-all duration-500 ease-in-out ${visibleNrTelList?"max-h-30 opacity-100":"max-h-0 opacity-0"} overflow-hidden overflow-y-auto scrollbar-thin bg-background w-full `}>
                    {
                      ["+40","+30","+99"].map((tel,iTel)=>(
                        <li className='px-1.5 py-2 border border-button/30 cursor-pointer hover:bg-button/30 transition-all duration-300 ease-in-out' key={iTel}>
                          <p>{tel}</p>
                        </li>
                      ))
                    }
                  </ul>
                </div>
                <input value={rezervarre.telefon}
                onChange={e=>setRezervarre({
                  ...rezervarre,
                  telefon:e.target.value
                })}
                className='border border-button/30 outline-0 w-full rounded-sm text-white px-3 py-2 ' type="tel" placeholder='Ex: 712 345 678' name="" id="" />
              </div>
            </div>
            <div className='text-gray-400'>
              <p className='mt-2'>Tara <span className='text-red-600'>*</span></p>
              
              <input value={rezervarre.tara}
              onChange={e=>setRezervarre({
                ...rezervarre,
                tara:e.target.value
              })}
              className='border w-full border-button/30 px-3 rounded-sm outline-0 text-white py-2 mt-2' type="text" placeholder='Ex: Romania' name="" id="" />

              {/*<div className='relative w-full mt-2'>
                <button onClick={()=>{setVisibleTaraList(!visibleTaraList)}} className={`flex w-[50%] justify-between items-center space-x-3 border border-button/30 px-1.5 py-2 hover:bg-button/30 cursor-pointer transition-all duration-300 ease-in-out ${visibleTaraList?"bg-button/30 rounded-t-sm":"bg-background rounded-sm"}`}>
                  <p>Selecteaza tara</p>
                  {visibleTaraList? <IoIosArrowUp />:<IoIosArrowDown />}
                </button>
                <ul className={`absolute z-30  transition-all duration-500 ease-in-out ${visibleTaraList?"max-h-30 opacity-100":"max-h-0 opacity-0"} overflow-hidden overflow-y-auto scrollbar-thin bg-background w-[50%] `}>
                  {
                    ["Romania","Anglia","Franta","Italia","Turcia","Grecia","Germania"].map((tara,iTara)=>(
                      <li className='px-1.5 py-2 border border-button/30 cursor-pointer hover:bg-button/30 transition-all duration-300 ease-in-out' key={iTara}>
                        <p>{tara}</p>
                      </li>
                    ))
                  }
                </ul>
              </div>*/}
              
            </div>

            <div className='text-gray-400'>
              <p className='mt-2'>Notite client</p>
              <div className='mt-2 relative'>
                <textarea name="" maxLength={300}
                value={rezervarre.notite_client} 
                onChange={e=>setRezervarre({
                  ...rezervarre,
                  notite_client:e.target.value
                })}
                className='w-full resize-none border border-button/30 rounded-sm pl-3 pr-14 scrollbar-thin py-3 outline-0 h-30' placeholder='Notile speciale despre client...' id=""></textarea>
                <p className='absolute text-[12px] right-4 bottom-1.5'><span className={`${rezervarre.notite_client.length<=250?"text-green-400":rezervarre.notite_client.length<=299?"text-orange-400":"text-red-600"}`}>{rezervarre.notite_client.length}</span>/300</p>
              </div>
            </div>
          </div>




          <div>
            <p className='font-medium'>Detalii rezervare</p>
            <div className='text-gray-400'>
              <p className='mt-2'>Hotel <span className='text-red-600'>*</span></p>
              <div className='relative w-full mt-2'>
                <button onClick={()=>{setVisibleHotelList(!visibleHotelList)}} className={`flex w-full justify-between items-center space-x-3 border border-button/30 px-3 py-2 hover:bg-button/30 cursor-pointer transition-all duration-300 ease-in-out ${visibleHotelList?"bg-button/30 rounded-t-sm":"bg-background rounded-sm"}`}>
                  {
                    hotelSelectat === null? <p>Selecteaza hotelul</p>:
                    <p>
                      {hotelSelectat.nume}
                    </p>
                  }
                  {visibleHotelList? <IoIosArrowUp />:<IoIosArrowDown />}
                </button>
                <ul className={`absolute z-30  transition-all duration-500 ease-in-out ${visibleHotelList?"max-h-30 opacity-100":"max-h-0 opacity-0"} overflow-hidden overflow-y-auto scrollbar-thin bg-background w-full `}>
                  {
                    hotelss.map((hotel,ihotel)=>(
                      <li onClick={()=>{
                        setHotelSelectat(hotel);
                        setHotelSlugSelectat(hotel.slug);
                        setRezervarre({
                          ...rezervarre,
                          hotel_id:hotel.id,
                          room_id:null,
                          tarif_id:null
                        });
                        setCamerele([]);
                        setCameraSelectata(null);
                        setVisibleHotelList(false);
                      }} className='px-3 py-2 border border-button/30 cursor-pointer hover:bg-button/30 transition-all duration-300 ease-in-out' key={hotel.id}>
                        <p>{hotel.nume}</p>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
            <div className='text-gray-400'>
              <p className='mt-2'>Camera <span className='text-red-600'>*</span></p>
              <div className='relative w-full mt-2'>
                <button onClick={()=>{setVisibleCameraList(!visibleCameraList)}} className={`flex w-full justify-between items-center space-x-3 border border-button/30 px-3 py-2 hover:bg-button/30 cursor-pointer transition-all duration-300 ease-in-out ${visibleCameraList?"bg-button/30 rounded-t-sm":"bg-background rounded-sm"}`}>
                  {
                    cameraSelectata === null? <p>Selecteaza camera</p>:
                    <p>{cameraSelectata.cod_camera}, {cameraSelectata.title}</p>
                  }
                  {visibleCameraList? <IoIosArrowUp />:<IoIosArrowDown />}
                </button>
                <ul className={`absolute z-30  transition-all duration-500 ease-in-out ${visibleCameraList?"max-h-30 opacity-100":"max-h-0 opacity-0"} overflow-hidden overflow-y-scroll scrollbar-thin bg-background w-full `}>
                  {
                    camerele.map((camera,icamera)=>(
                      <li onClick={()=>{
                        setCameraSelectata(camera);
                        setRezervarre({
                          ...rezervarre,
                          room_id:camera.id,
                          tarif_id:null
                        });
                        setVisibleCameraList(false);
                      }} className='px-3 py-2 border border-button/30 cursor-pointer hover:bg-button/30 transition-all duration-300 ease-in-out' key={camera.id}>
                        <p>{camera.cod_camera}, {camera.title}</p>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>

            <div className='text-gray-400 grid grid-cols-2 max-modf2:grid-cols-1 gap-3'>
              <div className='mt-2'>
                <p className=''>Check-in <span className='text-red-600'>*</span></p>

                <input value={rezervarre.check_in}
                onChange={e=>setRezervarre({
                  ...rezervarre,
                  check_in:e.target.value
                })}
                type="date" className='border border-button/30 px-3 py-2 mt-2 w-full [&::-webkit-calendar-picker-indicator]:invert  outline-0 rounded-sm' />
              </div>
              <div className='mt-2'>
                <p className=''>Check-out <span className='text-red-600'>*</span></p>

                <input value={rezervarre.check_out}
                onChange={e=>setRezervarre({
                  ...rezervarre,
                  check_out:e.target.value
                })}
                type="date" className='border border-button/30 px-3 py-2 mt-2 w-full outline-0 [&::-webkit-calendar-picker-indicator]:invert rounded-sm' />
              </div>
            </div>

            <div className='text-gray-400'>
              <p className='mt-2'>Oaspeti <span className='text-red-600'>*</span></p>
              <div className='grid grid-cols-3 gap-3'>
                <div className='mt-2'>
                  <p>Adulti</p>
                  <input
                  value={rezervarre.nr_adulti}
                  onChange={e=>setRezervarre({
                    ...rezervarre,
                    nr_adulti:e.target.value
                  })}
                  className='border border-button/30 w-full px-3 py-2 outline-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none rounded-sm mt-1' min={1} type="number"  name="" id="" />
                  
                </div>
                <div className='mt-2'>
                  <p>Copii</p>
                  <input
                  value={rezervarre.nr_copii}
                  onChange={e=>setRezervarre({
                    ...rezervarre,
                    nr_copii:e.target.value
                  })}
                  className='border [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none border-button/30 w-full px-3 py-2 outline-0 rounded-sm mt-1' min={0}  type="number" name="" id="" /> 
                </div>
                <div className='mt-2'>
                  <p>Sugari</p>
                  <input className='border border-button/30 w-full px-3 py-2 outline-0 rounded-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none mt-1' min={0} type="number" defaultValue={0} name="" id="" />
                </div>
              </div>
            </div>

            <div className='text-gray-400'>
              <p className='mt-2'>Cod promotional</p>
              <div className='flex space-x-3 mt-3 '>
                <div className='flex-3'>
                  <input type="text" className='border border-button/30 rounded-sm outline-0 px-3 py-2 w-full' name="" id="" />
                </div>
                <div className='flex-1'>
                  <button className='border w-full px-3 py-2 rounded-sm border-button/30  cursor-pointer bg-button  text-white hover:bg-button/60 transition-all duration-300 ease-in-out'>Aplica</button>
                </div>
              </div>
              
            </div>
          </div>

        </div>


        <div className='px-3 mt-3'>
          <p className='font-medium'>Informatii financiare</p>
          <div className={`grid ${visibleBara?"max-modf4:grid-cols-3 max-modf:grid-cols-2 max-modf2:grid-cols-1":"max-modf:grid-cols-3 max-modf1:grid-cols-2 max-modf2:grid-cols-1"} grid-cols-4 gap-x-3 gap-y-3 text-gray-400 mt-3`}>
            <div>
              <p>Tarif pe noapte</p>
              <div className='relative mt-2'>
                <button onClick={()=>{setVisibleTarifeRez(!visibleTarifeRez)}} className={`border border-button/30  pl-3 pr-15 py-2 text-start cursor-pointer hover:bg-button/50 transition-all ${visibleTarifeRez?"bg-button/50 rounded-t-sm":"rounded-sm"} duration-300 ease-in-out  w-full outline-0 text-white`}>
                  {
                    tarifSelectat === null? <p>Alege tariful</p>:
                    <p>{tarifSelectat.titlu_tarif}, la {tarifSelectat.pret_tarif} </p>
                  }
                </button>
                <p className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>RON</p>
                <ul className={`absolute overflow-hidden bg-background border transition-all duration-500 ease-in-out border-button/30 z-30 w-full left-0 ${visibleTarifeRez?"max-h-100 opacity-100":"max-h-0 opacity-0"}`}>
                  {
                    cameraSelectata?.tarife?.map(tarif=>(
                      <li onClick={()=>{
                        setTarifSelectat(tarif);
                        setRezervarre({
                          ...rezervarre,
                          tarif_id: tarif.id
                        });
                        setVisibleTarifeRez(false);
                      }} key={tarif.id} className={`px-3 py-2 hover:bg-button/50 transition-all duration-300 ease-in-out cursor-pointer`}>
                        <p>{tarif.titlu_tarif}, la {tarif.pret_tarif} </p>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>

            <div>
              <p>Perioada cazare</p>
              <div className='relative mt-2'>
                <p  className='border border-button/30  pl-3 pr-15 py-2 rounded-sm w-full outline-0 text-white'>
                 {
                   numar_nopti
                 }
                </p>
                <p className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>nopti</p>
              </div>
            </div>

            <div>
              <p>Reducere</p>
              <div className='relative mt-2'>
                <p  className='border border-button/30  pl-3 pr-15 py-2 rounded-sm w-full outline-0 text-white'>
                {cameraSelectata?.stare_activare_oferta === false ? 0 : cameraSelectata?.reducerea}
                </p>
                <p className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>%</p>
              </div>
            </div>

            <div>
              <p>Subtotal fara taxe si reducere</p>
              <div className='relative mt-2'>
                <p  className='border border-button/30  pl-3 pr-15 py-2 rounded-sm w-full outline-0 text-white '>
                  {
                    Math.round((tarifSelectat?.pret_tarif * numar_nopti)*100)/100 || 0
                  }</p>
                <p className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>RON</p>
              </div>
            </div>

            <div>
              <p>Taxe si comisioane</p>
              <div className='relative mt-2'>
                <p  className='border border-button/30  pl-3 pr-15 py-2 rounded-sm w-full outline-0 text-white '>{taxe}</p>
                <p className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>RON</p>
              </div>
            </div>

            <div>
              <p>Total</p>
              <div className='relative mt-2'>
                <p  className='border border-button/30  pl-3 pr-15 py-2 rounded-sm w-full outline-0 text-white '>
                {
                  cameraSelectata?.stare_activare_oferta === false? Math.round((tarifSelectat?.pret_tarif * numar_nopti +taxe)*100)/100 || 0
                  :Math.round(((tarifSelectat?.pret_tarif * numar_nopti + taxe)* (1 - cameraSelectata?.reducerea) )*100)/100 || 0
                }</p>
                <p className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>RON</p>
              </div>
            </div>

            <div>
              <p>Metoda plata</p>
              <div className='relative mt-2'>
                <p  className='border border-button/30  pl-3 pr-15 py-2 rounded-sm w-full outline-0 text-white '>Plata la cazare</p>
                
              </div>
            </div>

            <div>
              <p>Status</p>
              <div className='relative mt-2'>
                <p  className='border border-button/30  pl-3 pr-15 py-2 rounded-sm w-full outline-0 text-white '>Neplatit</p>
                
              </div>
            </div>




          </div>
        </div>




        <div className='flex mt-3 px-3 space-x-3 justify-end'>
          <button onClick={()=>{navigate("/admin/admin-rezervari"); window.scrollTo(0,0)}} className='border border-button/30 px-3  py-1.5 rounded-sm hover:bg-button/60 transition-all duration-300 ease-in-out cursor-pointer'>Inchide</button>
          <button onClick={creeazaRezervare} className='border border-button/30 px-3  py-1.5 rounded-sm hover:bg-button/60 transition-all bg-button duration-300 ease-in-out cursor-pointer'>Salveaza modificari</button>
        </div>

      </div>
      
      
    </div>
  )
}

export default AdminAdaugaRezervare
