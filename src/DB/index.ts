import mongoose from "mongoose";
import { MSG } from "../Constant/message";


export const connectDB = async () => {
    await mongoose.connect(`${process.env.DBURL}/${process.env.DBNAME}`);
    console.log(MSG.DBconnected);
}