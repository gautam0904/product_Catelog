import 'reflect-metadata'
import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import container from './config/inversify.config';
import { connectDB } from './DB/index';
import dotenv from 'dotenv';
import { MSG, errMSG } from './Constant/message'
import multer from "multer";
import cors from "cors";

dotenv.config();



const server = new InversifyExpressServer(container)

server.setConfig((app: express.Application) => {
    app.use(express.json());
    app.use(express.static('public'));
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({
        origin: '*', 
        credentials: true, 
    }));
    app.use((err : any, req : Request, res : Response, next : NextFunction) => {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          console.error(err);
          res.status(400).json({message :  'Multer Error: ' + err.message});
        } 
      });
});

const upload = multer({ dest: 'uploads/' });
const app = server.build();

connectDB().then(() =>{
    app.listen(process.env.port, () => {
        console.log(MSG.serverlisten ,process.env.port);
    });
}).catch((e) => {
    console.log(errMSG.connectDB,e);
})


// postman Document 
// https://documenter.getpostman.com/view/34230594/2sA3e2e8w6