import express from 'express'
import { createAddress, getAddress } from '../controllers/addressController.js'


const router = express.Router();

router.post('/add', createAddress);

router.get('/:userId', getAddress);

export default router;