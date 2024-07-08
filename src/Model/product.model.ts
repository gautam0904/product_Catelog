import mongoose from 'mongoose';
import { errMSG } from '../Constant/message';

const prouctSchema = new mongoose.Schema({
    name : {
        type : String ,
        required  : [true , errMSG.required('product Name')]
    },
    description : {
        type : String ,
        required  : [true , errMSG.required('product description')]
    },
    productimage : {
        type : String ,
        required  : [true ,errMSG.required('product image') ]
    },
    price:{
        type : Number ,
        required  : [true ,errMSG.required('product price')],
        defaultValue : 0
    },
    stock :{
        type : Number ,
        required  : [true , errMSG.required('product stock')],
        defaultValue : 0
    },
    category : {
        type : mongoose.Schema.ObjectId,
        ref : 'Category',
        required  : [true , errMSG.required('product category')]
    },
    owner : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required  : [true ,errMSG.required('product owner') ]
    }
},{timestamps : true });

export const Product  = mongoose.model('Product', prouctSchema)