import { Request, Response } from "express";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { Auth } from "../middleware/auth.middleware";
import { Role } from "../middleware/role.middleware";
import { upload } from "../middleware/multer.middleware";
import { inject } from "inversify"
import { Iproduct } from "../interface/model.interface";
import { ProductService } from "../Services";
import {TYPES} from "../types/types"
import { errMSG } from "../Constant/message";

@controller("/product", new Auth().handler)
export class ProductController {

    private product : ProductService;

    constructor(@inject( TYPES.ProductService) productServices: ProductService){
        this.product = productServices;
      
    }

    @httpPost("/create", new Role().handler, upload.fields([{
        name: "productimage",
        maxCount: 1
    }]))
    async create(req: Request, res: Response) {
        try {
            const productData: Iproduct = req.body;
            

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            const profilePictureLocalpath = files?.productimage?.[0]?.path;
            productData.productimage = profilePictureLocalpath;
            productData.owner = req.headers.USERID as string;
            const post = await this.product.createProduct(productData);

            res.status(post.statuscode).json(
                post.Content
            );
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message
            });
        }
    }


    @httpGet('/get')
    async get(req: Request, res: Response) {
        try {
            const id = req.query.id as string;
            
            const posts = await this.product.getProduct(id) ;
            res.status(posts.statuscode).json(
                posts.Content
            )

        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message
            })
        }
    }

    // @httpGet('/getfiltered')
    // async getFiltered(req: Request, res: Response) {
    //     try {
    //         const filter ={
    //             type :  req.query.type as string,
    //         } 
    //         const posts = await this.product.getFilteredContent(filter);
    //         res.status(posts.statuscode).json(
    //             posts.Content
    //         )
    //     } catch (error : any) {
    //         res.status(error.status || 500).json({
    //             message : error.message
    //         })
    //     }
    // }


    @httpDelete('/delete')
    async delete(req: Request, res: Response) {
        try {
            const id = req.query.Id as string;
            
            const deltepost = await this.product.deleteProduct(id);

            res.status(deltepost.statuscode).json(
                deltepost.Content
            )
        }
        catch(error : any){
            res.status(error.status || 500).json({
                message : error.message
            })
        }
    }

    @httpPut('/updatepicture', new Auth().handler, new Role().handler,upload.fields([{
        name: "productImage",
        maxCount: 1
    }]))
    async updatepitcure(req: Request, res: Response) {
        try {

            const updateData: Iproduct = req.body as Iproduct;
            
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const profilePictureLocalpath = files?.productImage?.[0]?.path;
            updateData.productimage = profilePictureLocalpath;


            const updated_user = await this.product.updateProductWithPicture(updateData.id as string, updateData);

            res.status(updated_user.statuscode).json(updated_user.Content);
        } catch (error: any) {
            res.status(error.statuscode).json({ message: error.message || errMSG.InternalServerErrorResult })
        }
    }
    @httpPut('/update', new Auth().handler, new Role().handler)
    async update(req: Request, res: Response) {
        try {

            const updateData: Iproduct = req.body as Iproduct;

            const updated_user = await this.product.updateProductWithoutPicture(updateData.id as string, updateData);

            res.status(updated_user.statuscode).json(updated_user.Content);
        } catch (error: any) {
            res.status(error.statuscode).json({ message: error.message || errMSG.InternalServerErrorResult })
        }
    }
}