import { injectable } from 'inversify'
import { Icategory } from '../interface/model.interface';
import { Category } from '../Model/category.model';
import { MSG, errMSG } from '../Constant/message';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';
import { statuscode } from '../Constant/statuscode';

@injectable()
export class CategoryService {
    constructor() { }
    async getCategory(id: string) {
        try {
            let result = {}
            if (id) {
                const _id = new mongoose.Types.ObjectId(id)
                result = await Category.find({owner : _id})
                if (!result) {
                    throw new ApiError(statuscode.NoteFound, errMSG.notFound("Category"))
                }
            } else {
                result = await Category.find();
            }
            return {
                statuscode: 200,
                Content:  result
            }
        } catch (error: any) {
            return {
                statuscode: error.statuscode || 500,
                Content: {
                    message: error.message || errMSG.defaultErrorMsg,
                    data: error
                }
            }
        }
    }

    async createCategory(productData: Icategory) {
        try {
            const result = await Category.create({
                name: productData.name,
                description: productData.description,
            });
            return {
                statuscode: 200,
                Content: {
                    message: MSG.success("Category created"),
                    data: result
                }
            }
        } catch (error: any) {
            return {
                statuscode: error.statuscode || 500,
                Content: {
                    message: error.message || errMSG.defaultErrorMsg,
                    data: error
                }
            }
        }
    }


   

    async updateCategory(id: string, productData: Icategory) {
        try {
            const result = await Category.findByIdAndUpdate({
                _id: id
            },
                {
                    name: productData.name,
                    description: productData.description,
                });

            return {
                statuscode: 200,
                Content: {
                    message: MSG.success("Category updated"),
                    data: result
                }
            }
        }
        catch (error: any) {
            return {
                statuscode: error.statuscode || 500,
                Content: {
                    message: error.message || errMSG.defaultErrorMsg,
                    data: error
                }
            }
        }

    }

    async deleteCategory(id: string) {
        try {
            const result = await Category.findByIdAndDelete(id);
            if (!result) {
                throw new ApiError(statuscode.NotImplemented, errMSG.notFound("Category"))
            }
            return {
                statuscode: 200,
                Content: {
                    message: MSG.success("Category deleted"),
                    data: result
                }
            }
        } catch (error: any) {
            return {
                statuscode: error.statuscode || 500,
                Content: {
                    message: error.message || errMSG.defaultErrorMsg,
                    data: error
                }
            }
        }
    }


}