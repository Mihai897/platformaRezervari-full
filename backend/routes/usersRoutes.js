import express from 'express';
import { adaugaRecenzieCamera, anuleazaRezervare, createAdminReservation, createReservation, getAllReservation, getAllReviewRoomByRoomId, getAllRewiewRooms, getAllRewivewRoomsByUserId, getAllUserReservation, getNotificariByUserId, getTipuriCalator, getUserHotelFav, getUserReservationByCod, getUserRoomsFav, getUsers, loginUser, registerUser, toggleFavoriteHotel, toggleFavoriteRoom, updatePozaProfil } from '../controllers/usersController.js';

const router = express.Router();

router.get('/',getUsers);
router.get('/rezervari',getAllReservation);
router.get('/rezervari/:id',getAllUserReservation);
router.get('/rezervari/:id/:codRezervare',getUserReservationByCod);
router.post('/rezervari',createReservation);
router.post('/rezervari/admin',createAdminReservation);
router.put("/rezervari/anuleaza/:id",anuleazaRezervare);
router.get('/recenzii-camere/:id',getAllRewivewRoomsByUserId);
router.get('/recenzii-camere',getAllRewiewRooms);
router.post("/reviews",adaugaRecenzieCamera);
router.get('/recenzii-camere/rooms/:room_id',getAllReviewRoomByRoomId);
router.get('/favorite-hotel/:id',getUserHotelFav);
router.post('/favorite-hotel/toggle',toggleFavoriteHotel);
router.get('/favorite-rooms/:id',getUserRoomsFav);
router.post('/favorite-rooms/toggle',toggleFavoriteRoom);
router.get('/notificari/:id',getNotificariByUserId);
router.get('/tip-calatori',getTipuriCalator);
router.post("/login",loginUser);
router.post("/register",registerUser);
router.put("/:id/poza-profil",updatePozaProfil);

export default router;