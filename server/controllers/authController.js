import bcrypt from 'bcrypt'
import User from '../model/User.js';
import jwt from 'jsonwebtoken';

export const signupUser = async (req, res)=>{
  try {

    const {username, email, password} = req.body;

    const exitUser = await User.findOne({email});

    if(exitUser){
      return res.status(400).json({
        message: 'User alredy exits'
      })
    }

    // Hash Password 

    const hashPassword = await bcrypt.hash(password, 10);

    // create User 
      await User.create({
        username,
        email,
        password : hashPassword
      });

      res.status(400).json({message: "user registered successfully"})

    
  }  catch (error) {
    res.status(500).json({
      message: "Server error",
      error
    })
    
  }
}


export const loginUser = async (req,res)=>{

 try {
  const {email, password} = req.body;
  
  const user = await User.findOne({email})
  // check if user already exits 
  if(!user){
    return res.status(404).json({message:"user not found"})
  }
  // comapare password 

  const matchPassword = await bcrypt.compare(password, user.password)

  if(!matchPassword){
      return res.status(401).json({
        message: "Invalid credintial"
      })
  }

  // generate JWT token 

   const token = jwt.sign(
      { id: user._id},
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );


res.status(200).json({message: "Login Successfull",
   token,

   user:{
    id:user._id,
      username: user.username,
      email: user.email
   }
  })
  
 } catch (error) {
  res.status(500).json({
    message: "server error ",
    error: error.message
  })
  
 }
}