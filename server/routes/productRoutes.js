import express from "express";

import { createProduct, getProducts, updateProducts, deleteProduct } from "../controllers/ProductController.js";

const router = express.Router();

// Route to create new products 
router.post('/add', createProduct)

// Route to get all products 
router.get('/', getProducts);

// Route to update a product with ID 
  router.put('/update/:id', updateProducts);

  // Route to delete a product by ID 

  router.delete('/delete/:id', deleteProduct);

  export default router;