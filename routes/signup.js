const express=require('express');
const bcrypt=require('bcrypt');
const User=require('../models/user');
const Joi = require('joi');
const router=express.Router();


router.post('/signup',async(req,res)=>{
    const {username,email,password}=req.body;
    const error=Validate(req.body)
const newUser=new User({
    username,email,password
})


if(error) return res.status(400).send(error.details[0].message)
const existedUser=await User.findOne({email})

if(existedUser){ return  res.status(400).send('user already registered')}
else{
    const salt=await bcrypt.genSalt(12);
    newUser.password=await bcrypt.hash(newUser.password,salt);
    const user=await newUser.save()
    res.status(200).json(user)

}

})


function Validate(obj){
    const schema=Joi.object({
        username:Joi.string().min(5).max(20),
      email:Joi.string().min(5).max(50).email(),
      password: Joi.string().min(5).max(500)
          ,
    });
  
  const {error}=schema.validate(obj);
  return error
  
  }



module.exports=router;








