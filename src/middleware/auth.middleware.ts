import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { BaseMiddleware } from "inversify-express-utils";
import jwt from "jsonwebtoken";
import { errMSG } from "../Constant/message" 
import { statuscode } from "../Constant/statuscode";
import { ApiError } from "../utils/ApiError";
import dotenv from 'dotenv'

dotenv.config();

const secretkey = process.env.AccessTokenSeceret || "";

export class Auth extends BaseMiddleware {
   
    
    handler(req: Request, res: Response, next: NextFunction): void {
        const token   = req.headers.token;

        if (!token) {
            res.status(401).json({
                message: errMSG.required("Access token")
            });
            return;
        }

        const tokenarray = (token as string).split(" ");

        if (tokenarray[0] !== "Bearer") {
          throw new ApiError(
            statuscode.NotAcceptable,
            errMSG.required("Bearer token")
          );
        }        

        jwt.verify(tokenarray[1] as string, secretkey, (err: any, decoded: any) => {
            if (err) {
              res.status(statuscode.Unauthorized).json({
                message : errMSG.expiredToken})
              return
            }
            req.find = decoded 
      
            req.headers.USERID = decoded.id;
            req.headers.ROLE = decoded.role;
                  
            next()
          })
    }
}