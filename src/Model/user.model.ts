import { Iuser } from '../interface/model.interface'
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {errMSG } from "../Constant/message";

const roleValues =['user' , 'admin']

const userschema = new mongoose.Schema<Iuser>( {
  name: {
  type: String,
  required: [true , errMSG.required('Name')]
},
email: {
  type: String,
  required: [true,errMSG.required('Email')],
  unique: true
},
password: {
  type: String,
  required: [true ,errMSG.required('Password')]
},
role : {
  type: String,
  enum : roleValues,
  required: [true ,errMSG.required('Role')],
},
profilePicture: {
  type : String
}
},{timestamps :true});

userschema.pre('save',async function(next){
  if(!this.isModified("password" )) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});



const User : mongoose.Model<Iuser> = mongoose.model("User",userschema);

export default User;