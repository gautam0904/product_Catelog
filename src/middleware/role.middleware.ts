import { Request, Response, NextFunction } from "express";
import { BaseMiddleware } from "inversify-express-utils";
import { ApiError } from "../utils/ApiError";
import { statuscode } from "../Constant/statuscode";
import { errMSG } from "../Constant/message";


export class Role extends BaseMiddleware{
    handler(req: Request, res: Response, next: NextFunction): void {
        try {
            const permission = {
                admin: ['/user/deleteUser', '/user/get', '/user/update','/user/updatepicture','/product/updatepicture','/product/update','/category/create','/category/get','/category/update','/category/delete','/product/create','/coupon/create','/coupon/get'],
               
                user : ['/product/get', '/user/update' , '/user/update','/user/updatepicture' , 'coupon/get']
            }

            const role = req.headers.ROLE as string;       
            const id = req.headers.USERID;       
            
            const currentRoute =
              req.protocol + "://" + req.get("host") + req.originalUrl;
            const parsedUrl = new URL(currentRoute);
            const pathname = parsedUrl.pathname;
            const userPermissions = permission[role as keyof typeof permission];
       
            if(userPermissions.includes(pathname)){
                next();
            }else{
                throw new ApiError(statuscode.forbidden , errMSG.notValidRole(role))
            }
        } catch (error : any) {
            res.status(error.statusCode || statuscode.NotImplemented).json({
                message : error.message
            })
        }
    }
} 