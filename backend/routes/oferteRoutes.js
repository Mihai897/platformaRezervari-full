import express from 'express';
import { createOferta, getAllActiveOffers, getAllOffers } from '../controllers/oferteController.js';
const router = express.Router();

router.get('/',getAllActiveOffers);
router.post("/",createOferta);
router.get('/toate',getAllOffers)

export default router;