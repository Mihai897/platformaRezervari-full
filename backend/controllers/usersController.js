import pool from '../db/db.js';

export const createReservation = async (req,res)=>{
  try {

    const {
      
      room_id,
      tarif_id,
      check_in,
      check_out,
      nr_adulti,
      nr_copii,
      email,
      notite_client
    } = req.body;


    if (
      !room_id ||
      !tarif_id ||
      !check_in ||
      !check_out ||
      !email
      ) {
      return res.status(400).json({
          mesaj: "Date incomplete."
      });
    }

    const user = await pool.query(

    `
      SELECT id
      FROM users
      WHERE email=$1
      `,
      [email]

    );

    if(user.rows.length===0){

      return res.status(404).json({

      mesaj:"Utilizatorul nu exista"

      });

    }


    const user_id = user.rows[0].id;


    const checkIn = new Date(check_in);
    const checkOut = new Date(check_out);

    const numar_nopti = Math.ceil(
    (checkOut - checkIn) / (1000 * 60 * 60 * 24)
    );
    if(numar_nopti<=0){

        return res.status(400).json({

            mesaj:"Perioada rezervarii este invalida."

        });

    }
    

    const tarif = await pool.query(
    `
    SELECT pret_tarif
    FROM tarife
    WHERE id=$1
    AND camera_id =$2
    `,
    [tarif_id,room_id]
    );
    if(tarif.rows.length===0){

      return res.status(404).json({

          mesaj:"Tariful nu exista."

      });

    }

    const pret_pe_noapte = Number(tarif.rows[0].pret_tarif);
    const pret_camera_fara_taxe =pret_pe_noapte * numar_nopti;
    const taxe_servicii = 30;
    const total_platit = pret_camera_fara_taxe + taxe_servicii;

    const oferta = await pool.query(
    `
      SELECT reducerea, stare_activare_oferta
      FROM oferte_camere
      WHERE camera_id = $1
      `,
      [room_id]
    );

    let total_platit_final = total_platit;

    if (
        oferta.rows.length > 0 &&
        oferta.rows[0].stare_activare_oferta
    ) {

        const reducere = Number(oferta.rows[0].reducerea);

        total_platit_final =
            total_platit * (1 - reducere);

    }




    const cod_rezervare = "RZ-" + Date.now();
   
    const rezervareNoua = await pool.query(

    `

    INSERT INTO rezervari

    (

    cod_rezervare,

    user_id,

    room_id,

    tarif_id,


    check_in,

    check_out,

    numar_nopti,


    nr_adulti,

    nr_copii,


    pret_pe_noapte,

    pret_camera_fara_taxe,


    taxe_servicii,

    total_platit,


    notite_client

    )


    VALUES

    (

    $1,$2,$3,$4,

    $5,$6,$7,

    $8,$9,

    $10,$11,

    $12,$13,

    $14

    )


    RETURNING *

    `,

    [

    cod_rezervare,

    user_id,

    room_id,

    tarif_id,


    check_in,

    check_out,

    numar_nopti,


    nr_adulti,

    nr_copii,


    pret_pe_noapte,

    pret_camera_fara_taxe,


    taxe_servicii,

    total_platit,


    notite_client

    ]


    );


  return res.status(201).json({

    mesaj:"Rezervarea a fost creata cu succes.",

    rezervare: {

        ...rezervareNoua.rows[0],

        total_platit_final

    }

  });

  } catch (err) {

      console.log(err);

      res.status(500).json({
          mesaj: "Eroare server."
      });

  }
}


export const registerUser = async (req,res) =>{
  try{
    const {
        nume,
        prenume,
        data_nasterii,
        gen,
        nationalitate,
        limba_preferata,
        email,
        telefon,
        parola,
        intrebare_securitate,
        raspuns_securitate,
        tara,
        oras,
        adresa,
        newsletter,
        termeni_acceptati
    } = req.body;

    const emailExistent = await pool.query(
        `
        SELECT id
        FROM users
        WHERE email=$1
        `,
        [email]
    );

    if(emailExistent.rows.length > 0){

      return res.status(400).json({
          mesaj:"Există deja un cont cu această adresă de email."
      });
    }

    const telefonExistent = await pool.query(
        `
        SELECT id
        FROM users
        WHERE telefon=$1
        `,
        [telefon]
    );

    if(telefonExistent.rows.length > 0){

        return res.status(400).json({
            mesaj:"Există deja un cont cu acest număr de telefon."
        });

    }

    const rezultat = await pool.query(
      `
      INSERT INTO users(
          nume,
          prenume,
          data_nasterii,
          gen,
          nationalitate,
          limba_preferata,
          email,
          telefon,
          parola_hash,
          intrebare_securitate,
          raspuns_securitate,
          tara,
          oras,
          adresa,
          newsletter,
          termeni_acceptati
      )
      VALUES(
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16
      )
      RETURNING
          id,
          nume,
          prenume,
          email,
          tara,
          telefon,
          rol,
          poza_profil 
      `,
      [
          nume,
          prenume,
          data_nasterii,
          gen,
          nationalitate,
          limba_preferata,
          email,
          telefon,
          parola,
          intrebare_securitate,
          raspuns_securitate,
          tara,
          oras,
          adresa,
          newsletter,
          termeni_acceptati
      ]);
    
    const user = rezultat.rows[0];

    res.status(201).json({

        mesaj:"Cont creat cu succes.",

        user:{
          id: user.id,
          nume: user.nume,
          prenume: user.prenume,
          email: user.email,
          tara: user.tara,
          telefon: user.telefon,
          rol: user.rol,
          poza_profil:user.poza_profil
        }

    });



  }
  catch(error){
    console.error(error);
    res.status(500).json({
      mesaj:"Eroare server"
    });
  }
}


export const loginUser = async (req,res) =>{
  try{
    const {email,parola} = req.body;
    const rezultat = await pool.query(
      `
        SELECT * FROM users WHERE email =$1
      `,[email]
    );

    if(rezultat.rows.length === 0) {
      return res.status(401).json({
        mesaj: "Email sau parola incorecte."
      });
    }
    const user = rezultat.rows[0];

    if(user.parola_hash !== parola) {
      return res.status(401).json({
        mesaj:"Email sau parola incorecte."
      });
    }

    res.status(200).json({
      mesaj: "Autentificare reusita.",
      user:{
        id: user.id,
        nume: user.nume,
        prenume: user.prenume,
        email: user.email,
        tara: user.tara,
        telefon: user.telefon,
        rol: user.rol,
        poza_profil:user.poza_profil
      }
    })

  }

  catch(error){
    console.error(error);
    res.status(500).json({
      mesaj: "Eroare la autentificare."
    })
  }
}


export const toggleFavoriteHotel = async(req,res)=>{


    try{


        const {
            user_id,
            hotel_id
        }=req.body;



        const verificare = await pool.query(
            `
            SELECT *
            FROM favorite_hotels
            WHERE user_id=$1
            AND hotel_id=$2
            `,
            [
                user_id,
                hotel_id
            ]
        );



        // exista deja -> stergem

        if(verificare.rows.length > 0){


            await pool.query(
                `
                DELETE FROM favorite_hotels
                WHERE user_id=$1
                AND hotel_id=$2
                `,
                [
                    user_id,
                    hotel_id
                ]
            );


            return res.status(200).json({
                favorit:false
            });


        }



        // nu exista -> adaugam


        await pool.query(
            `
            INSERT INTO favorite_hotels
            (
                user_id,
                hotel_id
            )
            VALUES
            ($1,$2)
            `,
            [
                user_id,
                hotel_id
            ]
        );



        res.status(200).json({
            favorit:true
        });



    }catch(error){

        console.error(error);

        res.status(500).json({
            mesaj:"Eroare toggle favorit"
        });

    }


}
export const toggleFavoriteRoom = async(req,res)=>{


    try{


        const {
            user_id,
            room_id
        }=req.body;



        const verificare = await pool.query(
            `
            SELECT *
            FROM favorite_rooms
            WHERE user_id=$1
            AND room_id=$2
            `,
            [
                user_id,
                room_id
            ]
        );



        // exista deja -> stergem

        if(verificare.rows.length > 0){


            await pool.query(
                `
                DELETE FROM favorite_rooms
                WHERE user_id=$1
                AND room_id=$2
                `,
                [
                    user_id,
                    room_id
                ]
            );


            return res.status(200).json({
                favorit:false
            });


        }



        // nu exista -> adaugam


        await pool.query(
            `
            INSERT INTO favorite_rooms
            (
                user_id,
                room_id
            )
            VALUES
            ($1,$2)
            `,
            [
                user_id,
                room_id
            ]
        );



        res.status(200).json({
            favorit:true
        });



    }catch(error){

        console.error(error);

        res.status(500).json({
            mesaj:"Eroare toggle favorit"
        });

    }


}

export const anuleazaRezervare = async(req,res)=>{
    try{

        const {id} = req.params;
        const {user_id} = req.body;


        // verificam ca rezervarea apartine userului
        const verificare = await pool.query(
            `
            SELECT *
            FROM rezervari
            WHERE id=$1 AND user_id=$2
            `,
            [
                id,
                user_id
            ]
        );


        if(verificare.rows.length===0){

            return res.status(404).json({
                mesaj:"Rezervarea nu exista"
            });

        }



        const rezervare = verificare.rows[0];


        if(
            rezervare.status_rezervare !== "Confirmata" &&
            rezervare.status_rezervare !== "In desfasurare"
        ){

            return res.status(400).json({
                mesaj:"Aceasta rezervare nu poate fi anulata"
            });

        }



        const rezultat = await pool.query(
            `
            UPDATE rezervari

            SET status_rezervare='Anulata'

            WHERE id=$1

            RETURNING *
            `,
            [
                id
            ]
        );



        res.status(200).json({

            mesaj:"Rezervarea a fost anulata",
            rezervare:rezultat.rows[0]

        });


    }catch(error){

        console.error(error);

        res.status(500).json({
            mesaj:"Eroare la anularea rezervarii"
        })

    }
}

export const adaugaRecenzieCamera = async(req,res)=>{
  try{

    const {
      user_id,
      room_id,
      tip_calator_id,
      rating,
      titlu,
      descriere
    } = req.body;


    if(!user_id || !room_id || !rating || !titlu || !descriere){
      return res.status(400).json({
        mesaj:"Campuri obligatorii lipsa"
      });
    }


    const rezultat = await pool.query(
      `
      INSERT INTO recenzii_camere
      (
        user_id,
        room_id,
        tip_calator_id,
        rating,
        titlu,
        descriere
      )

      VALUES($1,$2,$3,$4,$5,$6)

      RETURNING *
      `,
      [
        user_id,
        room_id,
        tip_calator_id || null,
        rating,
        titlu,
        descriere
      ]
    );


    res.status(201).json({
      mesaj:"Recenzie adaugata cu succes",
      recenzie:rezultat.rows[0]
    });


  }catch(error){

    console.error(error);

    res.status(500).json({
      mesaj:"Eroare la adaugarea recenziei"
    })

  }
}



export const updatePozaProfil = async (req,res)=>{
  try{
    const {id} = req.params;
    const {poza_profil} = req.body;
    const rezultat = await pool. query(
    `
    UPDATE users 
    SET poza_profil =$1
      WHERE id= $2
      RETURNING
      id,
      nume,
      prenume,
      email,
      tara,
      telefon,
      rol,
      poza_profil
    `,[poza_profil,id]
    );
    res.status(200).json(rezultat.rows[0]);
  }
  catch(error){
    console.error(error);
    res.status(500).json({
      mesaj:"Eroare schimbare poza profil"
    })
  }
}

export const getTipuriCalator = async(req,res)=>{

    try{

        const rezultat = await pool.query(`
            SELECT *
            FROM tipuri_calator
            ORDER BY id ASC
        `);


        res.status(200).json(rezultat.rows);


    }catch(error){

        console.error(error);

        res.status(500).json({
            mesaj:"Eroare la preluarea tipurilor de calator"
        });

    }

}


export const getNotificariByUserId = async (req,res)=>{
  try{
    const {id} = req.params;

    const rezultat = await pool.query(`
        SELECT * FROM notificari

        WHERE user_id = $1
      `,[id])


    res.status(200).json(rezultat.rows)

  }
  catch(error){
    console.error(error);
    res.status(500).json({
      mesaj:"Eroare la preluarea notificarilor"
    });
  }
} 


export const getUsers = async (req,res)=>{
  try{
    const rezultat = await pool.query(`SELECT 
      u.*,
      ur.data_rezervare AS utlima_rezervare,
      ur.id AS id_ultima_rezervare,

     
      
      CASE 
      WHEN u.created_at >= NOW() - INTERVAL '7 days'
      THEN true
      ELSE false
      end AS client_nou,

      CASE WHEN u.created_at< NOW()- INTERVAL '7 days'
      THEN true
      else FALSE
      END As client_fidel,

      COALESCE(rez.numar_rezervari,0) AS numar_rezervari,
      COALESCE(rez.total_cheltuit) AS total_cheltuit,
      COALESCE(rez.rezervari,'[]'::jsonb) AS rezervari
      
      FROM users u

      

      LEFT JOIN (
        SELECT DISTINCT ON (user_id)
          id,
          user_id,
          data_rezervare
        
          FROM rezervari

        ORDER BY user_id, data_rezervare DESC
      ) ur
      ON ur.user_id = u.id

      


      LEFT JOIN (

        SELECT 
          re.user_id,
          COUNT(*) AS numar_rezervari,
          
          COALESCE (SUM(
            CASE 
              WHEN o.stare_activare_oferta = true
              THEN re.total_platit - re.total_platit*o.reducerea
              ELSE re.total_platit
             END
          
          ),0) AS total_cheltuit,
          jsonb_agg(to_jsonb(re) ||
          jsonb_build_object(
          'camera_nume',rum.title,
          'reducere_camera',o.reducerea,
          'stare_activare_oferta', o.stare_activare_oferta,
          'total_platit_cu_oferta',
          CASE
            WHEN o.stare_activare_oferta = true
            THEN re.total_platit - re.total_platit*o.reducerea
            ELSE re.total_platit
          end,
          'numele_hotel', ho.nume
          )
          
          ) AS rezervari


          FROM rezervari re

          INNER JOIN rooms rum
          ON rum.id = re.room_id

          INNER JOIN hotels ho
          ON ho.id = rum.hotel_id

          LEFT JOIN oferte_camere o
          ON o.camera_id = rum.id
          

          GROUP BY re.user_id

      )rez
      ON rez.user_id = u.id


      ORDER BY u.id ASC
      `);
    res.status(200).json(rezultat.rows)
  }
  catch(error){
    console.error(error);
    res.status(500).json({
      mesaj: "Eroare la preluare users"
    })
  }
};

export const getUserRoomsFav = async (req,res)=>{
  try{
    const {id} = req.params;
    const rezultat = await pool.query(`
      SELECT fr.*,
      r.title,
      r.image,
      r.slugs,
      h.slug,
      h.nume,
      h.locatie,
      h.facilitate,
      h.facilitate1,
      h.anulare_gratuita,
      h.data_anulare,
      o.cod_oferta,
      o.stare_activare_oferta,
      o.reducerea,
      

      COALESCE(rc.rating_mediu,0) AS rating_camera,
      COALESCE(rc.numarul_recenziilor,0) AS numarul_recenziilor,
      COALESCE(t.tarife,'[]') AS tarife
       
      
      FROM favorite_rooms fr

      INNER JOIN rooms r
      ON fr.room_id = r.id

      INNER JOIN hotels h
      ON r.hotel_id = h.id

      LEFT JOIN oferte_camere o
      ON o.camera_id = r.id

      LEFT JOIN(
        SELECT
        room_id,
        ROUND(AVG(rating),1) AS rating_mediu,
        COUNT(*) AS numarul_recenziilor
        FROM recenzii_camere rc
        GROUP BY room_id
      ) rc
       ON rc.room_id = r.id
      
       LEFT JOIN (
        SELECT 
          camera_id,
          json_agg(t.* ORDER BY t.id) AS tarife
        FROM tarife t
        GROUP BY camera_id
       ) t
        ON t.camera_id = r.id

      
      
      
      WHERE fr.user_id =$1
      order by id
      `,[id])

    res.status(200).json(rezultat.rows)

  }
  catch(error){
    console.error(error);
    res.status(500).json({
      mesaj: "Eroare la preluarea camerelor favorite"
    })
  }
}


export const getUserHotelFav = async (req,res)=>{
  try{
    const {id} = req.params;
    const rezultat = await pool.query(`
      
      SELECT fh.*,
      h.nume,
      h.locatie,
      h.img,
      h.facilitate,
      h.facilitate1,
      h.anulare_gratuita,
      h.data_anulare,
      h.slug,
      COALESCE(rh.hotel_id,0) AS hotel_id,

      COALESCE(rh.rating_mediu,0) AS rating_hotel,
      COALESCE(rh.total_recenzii,0) AS total_recenzii
      
      
      FROM favorite_hotels fh

      INNER JOIN hotels h
      ON fh.hotel_id = h.id

      LEFT JOIN (
        SELECT
        r.hotel_id,
        ROUND(AVG(rc.rating),1) AS rating_mediu,
        COUNT(*) AS total_recenzii

        FROM recenzii_camere rc
        INNER JOIN rooms r
        ON rc.room_id = r.id

        GROUP BY r.hotel_id
      ) rh
       ON rh.hotel_id = h.id

      WHERE fh.user_id = $1
      `,[id])

    res.status(200).json(rezultat.rows)
  }
  catch(error){
    console.error(error);
    res.status(500).json({
      mesaj: "Eroare la preluarea hotelurilor favorite"
    })
  }
}



export const getAllReservation = async (req,res) =>{
  try{
    const rezulatat = await pool.query(`SELECT 
      re.*,
      u.nume,
      u.prenume,
      u.email,
      u.telefon,
      u.limba_preferata,
      u.tara,
      r.title AS nume_camera,
      r.image AS image_camera,
      h.nume AS nume_hotel,
      COALESCE(o.reducerea, 0) AS reducerea,
      COALESCE(o.stare_activare_oferta, false) AS stare_activare_oferta,

      CASE 
        WHEN COALESCE(o.stare_activare_oferta,false) = true
        THEN (re.total_platit -re.total_platit*(COALESCE(o.reducerea,0)))
        ELSE re.total_platit
      END AS total_platit_final

      
      FROM rezervari re

      INNER JOIN users u
      ON re.user_id = u.id

      INNER JOIN rooms r
      ON re.room_id = r.id

      INNER JOIN hotels h
      ON r.hotel_id = h.id

      LEFT JOIN oferte_camere o
      ON r.id = o.camera_id
      
      ORDER BY re.id ASC
      `);
    res.status(200).json(rezulatat.rows);
  }
  catch(error){
    console.error(error);
    res.status(500).json({
      mesaj:"Eroare la preluarea rezervarilor"
    })
  }
};

export const getUserReservationByCod = async (req,res)=>{
  try{
    const {id,codRezervare} = req.params;
    const rezulatat = await pool.query(`
      
      SELECT rez.*,
      u.nume,
      u.prenume,
      u.email,
      u.telefon,

      r.title AS nume_camera,
      r.image,

      h.nume AS nume_hotel,
      h.locatie,
      COALESCE(o.reducerea, 0) AS reducerea,
      COALESCE(o.stare_activare_oferta, false) AS stare_activare_oferta,

      COALESCE(rc.rating_mediu,0) AS rating_mediu,
      COALESCE(rc.numarul_recenziilor,0) AS numarul_recenziilor,

      CASE 
        WHEN COALESCE(o.stare_activare_oferta,false) = true
        THEN (rez.total_platit -rez.total_platit*(COALESCE(o.reducerea,0)))
        ELSE rez.total_platit
      END AS total_platit_final
      
      
      
      
      FROM rezervari rez

      INNER JOIN users u
      ON rez.user_id = u.id

      INNER JOIN rooms r
      ON rez.room_id = r.id

      INNER JOIN hotels h
      ON r.hotel_id = h.id

      LEFT JOIN oferte_camere o
      ON r.id = o.camera_id

      LEFT JOIN (
        SELECT 
        room_id,
        ROUND(AVG(rating),1) AS rating_mediu,
        COUNT(*) AS numarul_recenziilor
        FROM recenzii_camere
        GROUP BY room_id
      ) rc
       ON rc.room_id = r.id
      
      
      WHERE rez.user_id=$1 AND rez.cod_rezervare=$2
      
      
      `,[id,codRezervare])


    res.status(200).json(rezulatat.rows[0])
  }

  catch(error){
    console.error(error);
    res.status(500).json({
      mesaj: "Eroare la preluarea rezervarii dupa cod"
    })
  }
}


export const getAllUserReservation = async (req,res)=>{
  try {
    const {id} = req.params;
    const rezultat = await pool.query(`
      SELECT rez.*,

      r.title,
      r.image,
      h.nume,
      h.locatie,
      COALESCE(o.reducerea, 0) AS reducerea,
      COALESCE(o.stare_activare_oferta, false) AS stare_activare_oferta,

      COALESCE(rc.rating_mediu,0) AS rating_mediu,
      COALESCE(rc.numar_total,0) AS numarul_recenziilor,

      CASE 
        WHEN COALESCE(o.stare_activare_oferta,false) = true
        THEN (rez.total_platit -rez.total_platit*(COALESCE(o.reducerea,0)))
        ELSE rez.total_platit
      END AS total_platit_final


      FROM rezervari rez

      INNER JOIN users u
      ON rez.user_id = u.id

      INNER JOIN rooms r
      ON rez.room_id = r.id

      INNER JOIN hotels h
      ON r.hotel_id = h.id

      LEFT JOIN oferte_camere o
      ON r.id = o.camera_id

      LEFT JOIN (
        SELECT
        room_id,
        ROUND(AVG(rating),1) AS rating_mediu,
        COUNT(*) AS numar_total
        FROM recenzii_camere
        GROUP BY room_id
      ) rc
      ON rc.room_id =r.id
      

      

      WHERE rez.user_id = $1
      ORDER BY rez.id ASC
      `,
      [id]);

      res.status(200).json(rezultat.rows)
  }
  catch(error){
    console.error(error);
    res.status(500).json({
      mesaj: "Eroare la preloarea rezervarilor utilizatorului"
    })
  }
}

export const getAllRewiewRooms = async (req,res)=>{
  try{
    const rezultat = await pool.query(`SELECT * FROM recenzii_camere`)
    res.status(200).json(rezultat.rows)
  }

  catch(error){
    console.error(error);
    res.status(500).json({
      mesaj: "Eroare la preluarea recenziilor"
    });
  }
}

export const getAllRewivewRoomsByUserId = async (req,res)=>{
  try{
    const {id} = req.params;
    const rezulatat = await pool.query(`SELECT * FROM recenzii_camere WHERE user_id=$1`,[id]);
    res.status(200).json(rezulatat.rows)
  }
  catch(error){
    console.error(error);
    res.status(500).json({
      mesaj: "Eroare la preluarea recenziilor utilizatorului"
    });
  }
}

export const getAllReviewRoomByRoomId = async (req,res)=>{
  try{
    const {room_id} = req.params;
    const rezultat = await pool.query(`SELECT * FROM recenzii_camere WHERE room_id =$1`,[room_id]);
    res.status(200).json(rezultat.rows);
  }
  catch(error){
    console.error(error);
    res.status(500).json({
      mesaj: "Eroare la preloarea recenziilor camerei"
    })
  }
  
}