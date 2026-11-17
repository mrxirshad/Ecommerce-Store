import { product } from "../model/Product.js";

// Create Product
export const createProduct = async (req, res) => {
  try {
    const newProduct = await product.create(req.body);

    return res.status(201).json({
      message: "Product created successfully",
      newProduct
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {

    const {search, category} = req.query;
    let filter ={}
    if(search){
      filter.title = {$regex : search, $options : 'i'}

    }
    if(category){
      filter.category = category;
    }
    const products = await product.find(filter).sort({
      createdAt: -1
    });

    return res.status(200).json(products);

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Update Product
export const updateProducts = async (req, res) => {
  try {
    const updated = await product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      updated
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const deleted = await product.findByIdAndDelete(
      req.params.id
    );

    if (!deleted) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    return res.status(200).json({
      message: "Product deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};
