import mongoose from 'mongoose';
import { errMSG } from '../Constant/message';

const categorieschema = new mongoose.Schema({
    name : {
        type : String ,
        required  : [true , errMSG.required('category name')]
    },
    description : {
        type : String ,
        required  : [true , errMSG.required('category description')]
    }
},{timestamps : true});

export const Category = mongoose.model('Category', categorieschema);