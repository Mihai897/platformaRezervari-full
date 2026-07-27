import express from 'express';
import { createHotel, getAllHotels, getFacilitatiHotel, getHotelBySlug, getPoliticiHotel } from '../controllers/hotelController.js';
const router = express.Router();
router.get('/',getAllHotels);
router.get('/:slug',getHotelBySlug);

router.get('/:slug/facilitati',getFacilitatiHotel);
router.get('/:slug/politici',getPoliticiHotel);


router.post("/",createHotel);

export default router;