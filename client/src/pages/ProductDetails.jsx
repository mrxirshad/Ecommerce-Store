import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { api } from '../api/axios.js'
const ProductDetails = () => {

  const {id} = useParams();
  const [product, setProduct] = useState();

  const loadProduct = async ()=>{
    const response = await api.get("/products/");
    const newProduct = response.data.find((item)=> item._id === id);
    setProduct(newProduct);

  }
  useEffect(()=>{
      loadProduct();
  },[]);

  if(!product){
    return <div>Loading...</div>
  }
  return (
    <div className=' max-w-3xl mx-auto p-6'>
      <img className=' w-full h-40 object-contain bg-white rounded'
      src={product.image} 
      alt={product.title} 
      />
      <h1 className=' text-2xl font-bold mt-4'>{product.title}</h1>
      <p className=' text-gray-700 mt-2'>{product.description}</p>
      <p className=' text-xl font-semibold mt-4'>{product.price}</p>

      <button className='mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
        Add to Cart
      </button>
     
    </div>
  )
}

export default ProductDetails
