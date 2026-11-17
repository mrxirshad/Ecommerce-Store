import Address from "../model/Address.js";


// address create 
export const createAddress = async (req, res)=>{
  try {

    const addresses = await Address.create(req.body);
    res.status(200).json({
      message : 'Address created Successfully',
      addresses
    })
    
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error
    })
    
  }
}

// get address by user 
export const getAddress = async (req, res)=>{
  try {
    const addresses = await Address.find({
      userId : req.params.userId
    });
    res.json(addresses)
    
  } catch (error) {
    res.status(500).json({
      message : "Address feching error  ",
      error
    })
    
  }
}