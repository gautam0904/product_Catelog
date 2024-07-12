import { Request, Response } from "express";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { Auth } from "../middleware/auth.middleware";
import { Role } from "../middleware/role.middleware";
import { inject } from "inversify"
import { Icategory } from "../interface/model.interface";
import { CategoryService } from "../Services";
import {TYPES} from "../types/types"
import { statuscode } from "../Constant/statuscode";

@controller("/category", new Auth().handler)
export class CategoryController {

    private category : CategoryService;

    constructor(@inject( TYPES.CategoryService) categoryServices: CategoryService){
        this.category = categoryServices;
      
    }
    @httpPost("/create", new Role().handler)
    async create(req: Request, res: Response) {
        try {
            const categoryData: Icategory = req.body;

            const create_category = await this.category.createCategory(categoryData);

            res.status(create_category.statuscode).json(
                create_category.Content
            );
        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message ,
              
                
            });
        }
    }


    @httpGet('/get')
    async get(req: Request, res: Response) {
        try {
            const id = req.query.id as string;
            
            const get_category = await this.category.getCategory(id) ;
            res.status(get_category.statuscode).json(
                get_category.Content
            )

        } catch (error: any) {
            res.status(error.statusCode || 500).json({
                message: error.message
            })
        }
    }



    @httpDelete('/delete')
    async delete(req: Request, res: Response) {
        try {
            const id = req.query.Id as string;
            
            const deltecategory = await this.category.deleteCategory(id);

            res.status(deltecategory.statuscode).json(
                deltecategory.Content
            )
        }
        catch(error : any){
            res.status(error.status || 500).json({
                message : error.message
            })
        }
    }
    
    @httpPut('/update')
    async update(req: Request, res: Response) {
        try {
            const id = req.query.Id as string;

            const updateData: Icategory = req.body;

            const updated_category = await this.category.updateCategory(id, updateData);

            res.status(updated_category.statuscode).json(
                updated_category.Content 
            )
        } catch (error : any) {
            res.status(error.status || statuscode).json({
                message : error.message
            })
        }
    }
}