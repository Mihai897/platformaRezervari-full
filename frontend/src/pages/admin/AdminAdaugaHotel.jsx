import React, { useState } from 'react'
import { RiArrowRightSLine } from 'react-icons/ri';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { LuFileImage } from "react-icons/lu";
import hotels from '../hotels/Hotel/hotels'
import { LuClock4 } from "react-icons/lu";
import { IoClose } from "react-icons/io5";

const AdminAdaugaHotel = () => {

  const [hotel,setHotel] = useState({

    nume:"",
    locatie:"",
    oras:"",
    judet:"",
    cod_postal:"",

    slug:"",

    descriere:"",

    email_hotel:"",
    telefon_hotel:"",
    site_hotel:"",

    program_receptie:"",

    ora_check_in:"",
    ora_check_out:"",

    img: '',
    
    stare_activare_hotel:false,

    limbi_vorbite:[],

    facilitati:[],
    politici:[]

  })
  const [limba,setLimba]=useState("");
  const [imagine,setImagine] = useState("");

  const [numeFacilitate,setNumeFacilitate]=useState("");

  const [facilitateCurenta,setFacilitateCurenta] = useState(null);

  const [informatieFacilitate,setInformatieFacilitate]=useState("");

  const [numePolitica,setNumePolitica]=useState("");

  const [politicaCurenta,setPoliticaCurenta] = useState(null);

  const [informatiePolitica,setInformatiePolitica]=useState("");






const adaugaFacilitati=()=>{
  if(!numeFacilitate.trim()) return;

  const indexNou = hotel.facilitati.length;

  setHotel({
    ...hotel,
    facilitati: [
      ...hotel.facilitati,
      {
        nume:numeFacilitate,
        informatii:[]
      }
    ]
  });
  setFacilitateCurenta(indexNou);
  setNumeFacilitate('');
}

const adaugaPolitica=()=>{
  if(!numePolitica.trim()) return;

  const indexNou = hotel.politici.length;

  setHotel({
    ...hotel,
    politici: [
      ...hotel.politici,
      {
        nume:numePolitica,
        informatii:[]
      }
    ]
  });
  setPoliticaCurenta(indexNou);
  setNumePolitica('');
}









const adaugaInfoFacilitate=()=>{
  if(facilitateCurenta===null) return;
  if(!informatieFacilitate.trim()) return;
  const lista = [...hotel.facilitati];
  lista[facilitateCurenta].informatii.push(informatieFacilitate);
  setHotel({
    ...hotel,
    facilitati:lista
  });
  setInformatieFacilitate('');
}
const adaugaInfoPolitica=()=>{
  if(politicaCurenta===null) return;
  if(!informatiePolitica.trim()) return;
  const lista = [...hotel.politici];
  lista[politicaCurenta].informatii.push(informatiePolitica);
  setHotel({
    ...hotel,
    politici:lista
  });
  setInformatiePolitica('');
}

const stergeFacilitate = (index) =>{
  const lista = hotel.facilitati.filter((_,i)=>i!==index);
  setHotel({
    ...hotel,
    facilitati:lista
  });
  if(facilitateCurenta === index) {
    setFacilitateCurenta(null);
  } else if(facilitateCurenta>index){
    setFacilitateCurenta(facilitateCurenta-1);
  }
}
const stergePolitica = (index) =>{
  const lista = hotel.politici.filter((_,i)=>i!==index);
  setHotel({
    ...hotel,
    politici:lista
  });
  if(politicaCurenta === index) {
    setPoliticaCurenta(null);
  } else if(politicaCurenta>index){
    setPoliticaCurenta(politicaCurenta-1);
  }
}

const stergeLimba = (index) =>{
  const lista = hotel.limbi_vorbite.filter((_,i)=>i!==index);
  setHotel({
    ...hotel,
    limbi_vorbite:lista
  });
}


const stergeInfoFacilitate = (indexFacilitate,indexInfo)=>{
  const lista = [...hotel.facilitati];
  lista[indexFacilitate].informatii = lista[indexFacilitate].informatii.filter((_,i)=>i!== indexInfo);
  setHotel({
    ...hotel,
    facilitati:lista
  });
}
const stergeInfoPolitica = (indexPolitica,indexInfo)=>{
  const lista = [...hotel.politici];
  lista[indexPolitica].informatii = lista[indexPolitica].informatii.filter((_,i)=>i!== indexInfo);
  setHotel({
    ...hotel,
    politici:lista
  });
}





const handleChange = (e)=>{

  setHotel({

      ...hotel,

      [e.target.name]:e.target.value

  });

};



const adaugaHotel = async()=>{
  try{
    const raspuns = await fetch(

      `${import.meta.env.VITE_API_URL}/hotels`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body:JSON.stringify(hotel)
      }
    );
    const data = await raspuns.json();
    if(!raspuns.ok){
      alert(data.mesaj);
      return;
    }
    alert(data.mesaj);
    navigate("/admin/admin-hoteluri");
  } catch(erroare){
    console.log(erroare);
    alert("A aparut o eroare.");
  }
}


  const {visibleBara} = useOutletContext();
  const navigate = useNavigate();
  const [anulareButon,setAnulareButon] = useState(false);
  const [activareButon,setActivareButon] = useState(false);
  return (
    <div>

      <div className='flex items-center space-x-3 text-gray-400'>
        <Link to={"/admin/admin-angajati"} className='hover:text-white text-gray-400 transition-all duration-300 ease-in-out'>Hoteluri</Link>
        <RiArrowRightSLine className='text-[18px] mt-0.5'/>
        <p className='text-button'>Adauga hotel</p>
      </div>
      <div>
        <p className='mt-3 text-[18px] font-medium'>Adauga hotel</p>
        <p className='text-gray-400'>Completeaza infomratiile pentru a adauga un hotel nou.</p>
      </div>

      <div className='border border-button/30  py-3 mt-3 rounded-lg'>
        <p>Infomratii generale</p>
        <div className={`grid grid-cols-2 px-3 gap-3 pb-3 border-b-button/30 text-gray-400 border-b ${visibleBara?"max-modf1:grid-cols-1":" max-modf2:grid-cols-1"}`}>
          <div>
            <p className='mt-2'>Email hotel <span className='text-red-600'>*</span></p>
            <input className='border border-button/30 w-full px-3 outline-0 text-white py-2 mt-2' type="email"

name="email_hotel"

value={hotel.email_hotel}

onChange={handleChange}
 id="" />
          </div>
          <div>
            <p className='mt-2'>Telefon hotel <span className='text-red-600'>*</span></p>
            <input className='border border-button/30 w-full px-3 outline-0 text-white py-2 mt-2' type="text"

name="telefon_hotel"

value={hotel.telefon_hotel}

onChange={handleChange}

 id="" />
          </div>
          <div>
            <p className='mt-2'>Site hotel <span className='text-red-600'>*</span></p>
            <input className='border border-button/30 w-full px-3 outline-0 text-white py-2 mt-2' type="text"

name="site_hotel"

value={hotel.site_hotel}

onChange={handleChange}
 id="" />
          </div>
          <div>
            <p className='mt-2'>Nume hotel <span className='text-red-600'>*</span></p>
            <input className='border border-button/30 w-full px-3 outline-0 text-white py-2 mt-2' type="text" placeholder='Ex: water vila resort' value={hotel.nume}

onChange={handleChange}
 name="nume" id="" />
          </div>
          <div>
            <p className='mt-2'>URL hotel <span className='text-red-600'>*</span></p>
            <input className='border border-button/30 w-full px-3 outline-0 text-white py-2 mt-2' type="text" placeholder='Ex: hotel-continental' value={hotel.slug}

            onChange={handleChange}
            name="slug" id="" />
          </div>

          

          <div>
            <p className='mt-2'>Locatie <span className='text-red-600'>*</span></p>
            <input className='border border-button/30 w-full text-white px-3 outline-0 py-2 mt-2' type="text" placeholder='Ex: Strada principala, Bulevardul eroilor' name="locatie" id="" value={hotel.locatie}

onChange={handleChange}
 />
          </div>

          <div>
            <p className='mt-2'>Oras <span className='text-red-600'>*</span></p>
            <input className='border border-button/30 w-full text-white px-3 outline-0 py-2 mt-2' type="text" placeholder='Ex: Timisoara' name="oras" id="" value={hotel.oras}

onChange={handleChange}/>
          </div>

          <div>
            <p className='mt-2'>Judet <span className='text-red-600'>*</span></p>
            <input className='border border-button/30 w-full text-white px-3 outline-0 py-2 mt-2' type="text" placeholder='Ex: Mehedinti' name="judet"

value={hotel.judet}

onChange={handleChange}
  id="" />
          </div>

          <div>
            <p className='mt-2'>Cod postal</p>
            <input className='border border-button/30 w-full text-white px-3 outline-0 py-2 mt-2' type="text" placeholder='Ex: 20100' name="cod_postal"

value={hotel.cod_postal}

onChange={handleChange}
 id="" />
          </div>


          <div>
            <p className='mt-3 text-gray-400'>O scurta descriere a hotelului. </p>
            <div className='relative'>
              <textarea  name="descriere"

value={hotel.descriere}

onChange={handleChange}
  className='border border-button/30 w-full h-20 resize-none outline-0 mt-1 rounded-sm pl-3 pr-12.5 scrollbar-thin py-1.5' placeholder='' maxLength={150} id=""></textarea>
              <p className='absolute text-[11.5px] text-gray-400 right-3.5 bottom-1.5'><span>{hotel.descriere.length}</span>/150</p>
            </div>
          </div>


        </div>

        <p className='mt-3 px-3'>Imagine hotel</p>
        <div className='flex modf:space-x-3 mt-3 max-modf:flex-col max-modf:space-y-3 max-modf:px-3'>
          <div className='flex-1  h-50 border px-3 py-3 modf:ml-3 max-modf1:w-full border-button rounded-sm shrink-0 flex justify-center items-center flex-col space-y-1'>
            <LuFileImage className='shrink-0 text-button text-[30px]'/>
            <p>Incarca URL imagine</p>
            <input type="text" className='border w-full outline-0 px-3 py-2 mb-3 rounded-lg border-button/30' name="" value={imagine}
            onChange={(e)=>setImagine(e.target.value)}
            onKeyDown={(e)=>{
              if(e.key==="Enter"){
                e.preventDefault();
                setHotel({
                  ...hotel,
                  img: imagine
                });
              }
            }}
            id="" />

            <button onClick={()=>setHotel({
              ...hotel,
              img: imagine
            })} className=' px-3 py-1.5 rounded-sm bg-button hover:bg-button/60 transition-all duration-300 ease-in-out cursor-pointer'>Adauga imagine</button>
          </div>
           
            <div className='flex-1 '>
              <img className='w-full max-modf:h-100 max-modf8:h-70 shrink-0' src={hotel?.img} alt="" />
            </div>
            
            
            
         
        </div>



        <div className={`mt-6 px-3 grid grid-cols-3 ${visibleBara?"max-modf4:grid-cols-2 max-modf1:grid-cols-1":"max-modf:grid-cols-2 max-modf2:grid-cols-1"} gap-3`}>
          


          <div className='px-3 py-3 border border-button/60 rounded-sm'>
            <p>Anulare gratuita</p>
            <div className='mt-2 flex space-x-3 items-center text-gray-400'>
              <button onClick={()=>setAnulareButon(!anulareButon)} className={`w-10 h-5 cursor-pointer shrink-0 rounded-full relative transition-all duration-300 ease-in-out ${anulareButon===false?"bg-gray-400":"bg-button"}`}>
                <div className={`w-[50%] h-full top-1/2 -translate-y-1/2 bg-white rounded-full transition-all duration-300 ease-in-out ${anulareButon===false?"translate-x-0":"translate-x-full"} absolute`}></div>
              </button>
              <p>Hotelul ofera anulare gratuita.</p>
            </div>

            <p className='text-gray-400 mt-2'>Pana la </p>
            <input type="date" className='rounded-sm outline-0 border [&::-webkit-calendar-picker-indicator]:invert border-button/30 px-3 py-1.5 mt-2 w-full ' name="" id="" />
            <p className='text-gray-400 mt-2'>Data limita pana la care anularea este gratuita.</p>
          </div>



          <div className='px-3 py-3 border border-button/60 rounded-sm'>
            <p>Receptie</p>

            <div className='mt-2 text-gray-400'>
              <p>Program receptie</p>
              <div className='relative mt-3'>
                <input type="text" className='border border-button/30 px-3 py-1.5  w-full rounded-sm outline-0 peer text-white' placeholder='' name="program_receptie" 
                value={hotel.program_receptie} onChange={handleChange} id="" />
                <span className='text-white top-1/2 -translate-y-1/2 absolute left-3 pointer-events-none transition-all duration-300 ease-in-out
                peer-placeholder-shown:top-1/2
                peer-placeholder-shown:-translate-y-1/2
                peer-not-placeholder-shown:text-[10px]
                peer-not-placeholder-shown:-top-0.5
                peer-not-placeholder-shown:px-2
                peer-not-placeholder-shown:bg-background
                peer-not-placeholder-shown:text-button
                peer-focus:text-[10px]
                peer-focus:-top-0.5
                peer-focus:px-2
                peer-focus:bg-background
                peer-focus:text-button
                '>Indroduceti programul</span>
              </div>

              <p className='mt-2'>Check-in/Check-out</p>
              <div className='grid max-modf8:grid-cols-1 grid-cols-2 gap-3 '>
                <input type="time"

name="ora_check_in"

value={hotel.ora_check_in}

onChange={handleChange}
 className='rounded-sm outline-0 border [&::-webkit-calendar-picker-indicator]:invert border-button/30 px-3 py-1.5 mt-2 w-full '  id="" />
                <input type="time" className='rounded-sm outline-0 border [&::-webkit-calendar-picker-indicator]:invert border-button/30 px-3 py-1.5 mt-2 w-full ' name="ora_check_out"

value={hotel.ora_check_out}

onChange={handleChange}
 id="" />
              </div>
              <p className='text-gray-400 mt-2'>Orele in care receptia este deschisa.</p>
            </div>
          </div>

          <div className='px-3 py-3 border border-button/60 rounded-sm'>
            <p>Activeaza hotelul</p>

            <div className='mt-2 text-gray-400'>
               <div className='mt-2 flex space-x-3 items-center text-gray-400'>
                  <button onClick={()=>{

setHotel({

...hotel,

stare_activare_hotel:
!hotel.stare_activare_hotel

})

}}
 className={`w-10 h-5 cursor-pointer  shrink-0  rounded-full relative transition-all duration-300 ease-in-out ${hotel.stare_activare_hotel===false?"bg-gray-400":"bg-button"}`}>
                    <div className={`w-[50%] h-full top-1/2 -translate-y-1/2 bg-white rounded-full transition-all duration-300 ease-in-out ${hotel.stare_activare_hotel===false?"translate-x-0":"translate-x-full"} absolute`}></div>
                  </button>
                  <p>Prin activarea hotelului, acesta va fi vizibil pe toate paginile tuturor utilizatorilor.</p>
                </div>
              
            </div>
          </div>
        </div>


        <div className='mt-6 '>
          
          <div className='border-y  py-3 border-button/30 px-3'>
            <p className=''>Limbi vorbite</p>

            <div className={`flex ${visibleBara?"max-modf:flex-col max-modf:items-start max-modf:space-y-3":"max-modf2:flex-col max-modf2:items-start max-modf2:space-y-3"} space-x-3 items-center`}>
              <div>
                <p className='text-gray-400'>Introduceti cate o limba care se vorbeste in hotel:</p>
              </div>
              <div className={` relative ${visibleBara?"flex-2 max-modf:w-full":"flex-2 max-modf2:w-full"}`}>
                <input type="text" className='border w-full border-button/30 px-3 py-1.5 rounded-sm outline-0 peer' placeholder='' name="" id=""
                value={limba}
                onChange={(e)=>setLimba(e.target.value)}
                onKeyDown={(e)=>{
                  if(e.key ==="Enter"){
                    e.preventDefault();
                    setHotel({
                      ...hotel,
                      limbi_vorbite:[
                        ...hotel.limbi_vorbite,
                        limba
                      ]
                    });
                    setLimba('');
                  }
                }}
                />
                <span className='absolute left-3 top-1/2 -translate-y-1/2  pointer-events-none transition-all duration-300 ease-in-out text-white
                peer-placeholder-shown:top-1/2
                peer-placeholder-shown:-translate-y-1/2
                peer-not-placeholder-shown:-top-0.5
                peer-not-placeholder-shown:text-[10px]
                peer-not-placeholder-shown:bg-background
                peer-not-placeholder-shown:px-1
                peer-not-placeholder-shown:text-button
                peer-focus:-top-0.5
                peer-focus:text-[10px]
                peer-focus:bg-background
                peer-focus:px-1
                peer-focus:text-button
                '>Introduceti limba</span>
              </div>
            </div>
             


            <p className='mt-1 text-gray-400'>Lista limbilor selectate:</p>
            <ul className='overflow-x-auto overflow-hidden scrollbar-thin flex space-x-3 pb-3 mt-3'>
              {
                hotel.limbi_vorbite.map((limba,i)=>(
                  <li className='flex space-x-3 items-center py-0.5 rounded-sm bg-button/30 px-3'>
                    <p>{limba}</p>
                    <IoClose onClick={()=>stergeLimba(i)} className='mt-0.5 cursor-pointer'/>
                  </li>
                ))
              }
            
            </ul>
          </div>
        </div>

        <div className='mt-6 border-y border-y-button/30 py-3'>
          <div className='px-3 '>
            <p>Politicile hotelului</p>
            <p className='text-gray-400'>Completati in casetele de mai jos numele politici pe care doriti sa o introduceti si cate o informatie despre acea politica:</p>
          </div>

          <div className={`grid mt-4 grid-cols-2 ${visibleBara?"max-modf:grid-cols-1":"max-modf1:grid-cols-1"} px-3 gap-3 max-modf8:text-[14px]`}>
            <div className=' relative'>
              <input className='border border-button/30 px-3 py-1.5 rounded-sm outline-0 peer w-full' type="text" placeholder='' name="" id="" value={numePolitica}

onChange={(e)=>setNumePolitica(e.target.value)}

onKeyDown={(e)=>{

if(e.key==="Enter"){
e.preventDefault();
adaugaPolitica();

}

}}

 />
              <span className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-in-out
              peer-placeholder-shown:top-1/2
              peer-placeholder-shown:-translate-y-1/2
              peer-not-placeholder-shown:-top-0.5
              peer-not-placeholder-shown:text-[10px]
              peer-not-placeholder-shown:px-2
              peer-not-placeholder-shown:bg-background
              peer-not-placeholder-shown:text-button
              peer-focus:-top-0.5
              peer-focus:text-[10px]
              peer-focus:px-2
              peer-focus:bg-background
              peer-focus:text-button
              '>Indroduceti numele politicii</span>
            </div>
            <div className=' relative'>
              <input className='border border-button/30 px-3 py-1.5 rounded-sm outline-0 peer w-full' type="text" placeholder='' name="" id="" value={informatiePolitica}
  onChange={(e)=>setInformatiePolitica(e.target.value)}
  onKeyDown={(e)=>{
    if(e.key==="Enter"){
      e.preventDefault();
      adaugaInfoPolitica();
    }
  }}
 />
              <span className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-in-out
              peer-placeholder-shown:top-1/2
              peer-placeholder-shown:-translate-y-1/2
              peer-not-placeholder-shown:-top-0.5
              peer-not-placeholder-shown:text-[10px]
              peer-not-placeholder-shown:px-2
              peer-not-placeholder-shown:bg-background
              peer-not-placeholder-shown:text-button
              peer-focus:-top-0.5
              peer-focus:text-[10px]
              peer-focus:px-2
              peer-focus:bg-background
              peer-focus:text-button
              '>Indroduceti o informatie despre politica</span>
            </div>
          </div>
          <p className='px-3 mt-3 text-gray-400'>Lista politicilor si informatiilor selectate:</p>
          <ul className='overflow-x-auto overflow-hidden scrollbar-thin pb-3 space-y-3 px-3 mt-3'>
            {
              hotel.politici.map((politica,index)=>(
                <li key={index} className='shrink-0 text-gray-400'>
                  <p className='flex space-x-3'><span>Nume politica:</span> <span className='bg-button/30 px-3 rounded-sm flex items-center space-x-3'><p>{politica.nume}</p> <IoClose onClick={()=>stergePolitica(index)} className='mt-0.5 cursor-pointer'/></span></p>

                  <ul className='flex space-x-3 mt-2'>
                    <p className='mt-1.5 shrink-0'>Lista informatiilor despre aceasta politica:</p>
                    {
                      politica.informatii.map((info,i)=>(
                        <li key={i} className='shrink-0 flex items-center space-x-3 bg-button/30 px-3 rounded-sm'>
                          <p>{info}</p>
                          <IoClose onClick={()=> stergeInfoPolitica(index,i)} className='mt-0.5 cursor-pointer'/>
                        </li>
                      ))
                    }
                  </ul>
                </li>
              ))
            }
          </ul>
        </div>
        <div className='my-6 border-y border-y-button/30 py-3'>
          <div className='px-3 '>
            <p>Facilitatile hotelului</p>
            <p className='text-gray-400'>Completati in casetele de mai jos numele facilitatii pe care doriti sa o introduceti si cate o informatie despre aceasta facilitate:</p>
          </div>

          <div className={`grid mt-4 grid-cols-2 ${visibleBara?"max-modf:grid-cols-1":"max-modf1:grid-cols-1"} px-3 gap-3 max-modf8:text-[14px]`}>
            <div className=' relative'>
              <input className='border border-button/30 px-3 py-1.5 rounded-sm outline-0 peer w-full' type="text" placeholder='' name="" id="" value = {numeFacilitate} 
              onChange={(e)=>{
                setNumeFacilitate(e.target.value)
                }              
              }
              onKeyDown={(e)=>{
                if(e.key==="Enter"){
                  e.preventDefault();
                  adaugaFacilitati();
                }
              }}
              
              
              />
              <span className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-in-out
              peer-placeholder-shown:top-1/2
              peer-placeholder-shown:-translate-y-1/2
              peer-not-placeholder-shown:-top-0.5
              peer-not-placeholder-shown:text-[10px]
              peer-not-placeholder-shown:px-2
              peer-not-placeholder-shown:bg-background
              peer-not-placeholder-shown:text-button
              peer-focus:-top-0.5
              peer-focus:text-[10px]
              peer-focus:px-2
              peer-focus:bg-background
              peer-focus:text-button
              '>Indroduceti numele facilitatii</span>
            </div>
            <div className=' relative'>
              <input className='border border-button/30 px-3 py-1.5 rounded-sm outline-0 peer w-full' type="text" placeholder='' name="" id="" value={informatieFacilitate}
              onChange={(e)=>setInformatieFacilitate(e.target.value)}
              onKeyDown={(e)=>{
                if(e.key==="Enter"){
                  e.preventDefault();
                  adaugaInfoFacilitate();
                }
              }}
              />
              <span className='absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ease-in-out
              peer-placeholder-shown:top-1/2
              peer-placeholder-shown:-translate-y-1/2
              peer-not-placeholder-shown:-top-0.5
              peer-not-placeholder-shown:text-[10px]
              peer-not-placeholder-shown:px-2
              peer-not-placeholder-shown:bg-background
              peer-not-placeholder-shown:text-button
              peer-focus:-top-0.5
              peer-focus:text-[10px]
              peer-focus:px-2
              peer-focus:bg-background
              peer-focus:text-button
              '>Indroduceti o informatie despre facilitate</span>
            </div>
          </div>
          <p className='px-3 mt-3 text-gray-400'>Lista facilitatilor si informatiilor selectate:</p>
          <ul className='overflow-x-auto overflow-hidden scrollbar-thin pb-3   space-y-3 px-3 mt-3'>

            {
              hotel.facilitati.map((facilitate,index)=>(
                <li key={index} className='shrink-0 text-gray-400'>
                  <p className='flex space-x-3'><span>Nume facilitate:</span> <span className='bg-button/30 px-3 rounded-sm flex items-center space-x-3'><p>{facilitate.nume}</p> <IoClose onClick={()=>stergeFacilitate(index)} className='mt-0.5 cursor-pointer'/></span></p>

                  <ul className='flex space-x-3 mt-2'>
                    <p className='mt-1.5 shrink-0'>Lista informatiilor despre aceasta facilitate:</p>
                    {
                      facilitate.informatii.map((info,i)=>(
                        <li key={i} className='shrink-0 flex items-center space-x-3 bg-button/30 px-3 rounded-sm'>
                          <p>{info}</p>
                          <IoClose onClick={()=> stergeInfoFacilitate(index,i)} className='mt-0.5 cursor-pointer'/>
                        </li>
                      ))
                    }
                  </ul>
                </li>
              ))
            }
          </ul>
        </div>



        <div className='flex mt-3 px-3 space-x-3 justify-end'>
          <button onClick={()=>{navigate("/admin/admin-hoteluri"); window.scrollTo(0,0)}} className='border border-button/30 px-3  py-1.5 rounded-sm hover:bg-button/60 transition-all duration-300 ease-in-out cursor-pointer'>Inchide</button>
          <button onClick={adaugaHotel} className='border border-button/30 px-3  py-1.5 rounded-sm hover:bg-button/60 transition-all bg-button duration-300 ease-in-out cursor-pointer'>Salveaza modificari</button>
        </div>
        

      </div>
      
      
      
    </div>
  )
}

export default AdminAdaugaHotel
