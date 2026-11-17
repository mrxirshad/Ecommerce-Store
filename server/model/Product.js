import mongoose from "mongoose";

const newProduct = new mongoose.Schema({
 title:{
  type: String,
  required : true
          },
          description:{
            type: String
          },
          price:{
            type: Number,
            required : true
          },
          category:{
            type: String
          },
          image:{
            type: String,
          },
          stock:{
            type : Number,
            default: 0
          },

          },{
            timestamps : true
    })

    export const product = mongoose.model("Product", newProduct);
    export default product;
  