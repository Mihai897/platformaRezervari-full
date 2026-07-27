import express from 'express';
import { createRoom, getAllRooms, getRecenziiStatsByHotelSlug, getRoomBySlug, getRoomsByHotelSlug, getRoomsRecenziiByHotelSlug, getRoomsWithoutOOffer, stergeCamera } from '../controllers/roomController.js';
const router = express.Router();
router.get('/',getAllRooms);
router.post('/',createRoom);
router.delete('/:id',stergeCamera);


router.get('/:slug/fara-oferte', getRoomsWithoutOOffer);


router.get('/:slug/recenzii',getRoomsRecenziiByHotelSlug);
router.get('/:slug/recenzii/stats',getRecenziiStatsByHotelSlug);
router.get('/:slug/:roomSlug', getRoomBySlug);

router.get('/:slug',getRoomsByHotelSlug);
export default router;