import express from 'express'

import { addTocart, removeCart, updateQuantity, getCart } from '../controllers/cartController.js'


const router = express.Router();

// add item to cart 
router.post('/add', addTocart);

// Remove from cart 
router.post('/remove', removeCart);

// Update item quanity in cart 
router.post('/update', updateQuantity);

// get user's cart 

router.get('/:userId', getCart);

export default router;