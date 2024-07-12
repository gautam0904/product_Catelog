import { injectable } from 'inversify'
import { Iproduct } from '../interface/model.interface';
import { deleteonCloudinary, uploadOnCloudinary } from '../utils/cloudinary';
import { Product } from '../Model/product.model';
import { MSG, errMSG } from '../Constant/message';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError';
import { statuscode } from '../Constant/statuscode';
import { IfilterProduct } from '../interface/request.interface';

@injectable()
export class ProductService {
    constructor() { }
    cloudinaryurl = ""
    async getProduct(id: string) {
        try {
            let result = {}
            if (id) {

                const _id = new mongoose.Types.ObjectId(id)

                result = await Product.find({ owner: _id })
                if (!result) {
                    throw new ApiError(statuscode.NoteFound, errMSG.notFound("Product"))
                }
            } else {
                result = await Product.find();
            }
            return {
                statuscode: 200,
                Content: {
                    message: MSG.success("Product fetched"),
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

    async createProduct(productData: Iproduct) {
        try {
            const productloudinary = await uploadOnCloudinary(productData.productimage);
            this.cloudinaryurl = productloudinary?.url || ""

            const result = await Product.create({
                name: productData.name,
                description: productData.description,
                productimage: productloudinary?.url,
                owner: productData.owner,
                price: productData.price,
                stock: productData.stock,
                category: productData.category
            });
            this.cloudinaryurl = ''
            return {
                statuscode: 200,
                Content: {
                    message: MSG.success("Product created"),
                    data: result
                }
            }
        } catch (error: any) {
            deleteonCloudinary(this.cloudinaryurl).then((response) => {
                this.cloudinaryurl = "";
            });
            return {
                statuscode: error.statuscode || 500,
                Content: {
                    message: error.message || errMSG.defaultErrorMsg,
                    data: error
                }
            }
        }
    }


    async updateProductWithPicture(id: string, productData: Iproduct) {
        try {

            const existProduct = await Product.findById(id);

            let result;
            await deleteonCloudinary(existProduct?.productimage as string).then(async (response) => {
                const productImg = await uploadOnCloudinary(productData.productimage);

                result = await Product.findByIdAndUpdate(
                    {
                        _id: id,
                    },
                    {
                        $set: {
                            name: productData.name,
                            description: productData.description,
                            owner: productData.owner,
                            price: productData.price,
                            stock: productData.stock,
                            category: productData.category,
                            productimage: productImg?.url
                        },
                    },
                    { new: true }
                );
                if (result) {
                    return {
                        statuscode: statuscode.ok,
                        Content: result,
                    };
                }
                throw new ApiError(statuscode.NotImplemented, errMSG.updateUser);
            }).catch((err: any) => {
                throw new ApiError(statuscode.NotImplemented, errMSG.updateUser);
            });

            return {
                statuscode: statuscode.ok,
                Content: result,
            };

        } catch (error: any) {
            deleteonCloudinary(this.cloudinaryurl).then((response) => {
                this.cloudinaryurl = "";
            });
            return {
                statuscode: error.statusCode || statuscode.NotImplemented,
                Content: error.message,
            };
        }

    } catch(error: any) {
        return {
            statuscode: error.statuscode || 500,
            Content: {
                message: error.message || errMSG.defaultErrorMsg,
                data: error
            }
        }
    }

    async updateProductWithoutPicture(id: string, productData: Iproduct) {
        try {
            const result = await Product.findByIdAndUpdate({
                _id: id
            },
                {
                    name: productData.name,
                    description: productData.description,
                    owner: productData.owner,
                    price: productData.price,
                    stock: productData.stock,
                    category: productData.category
                });

            return {
                statuscode: 200,
                Content: {
                    message: MSG.success("Product updated"),
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

    async deleteProduct(id: string) {
        try {
            const result = await Product.findByIdAndDelete(id);

            return {
                statuscode: 200,
                Content: {
                    message: MSG.success("Product deleted"),
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

    async getFilteredProduct(QuryData: IfilterProduct) {
        try {
            const requestFilter = {
                category: QuryData.category,
                search: QuryData.search,
                maxprice: parseInt(QuryData.maxprice),
                minprice: parseInt(QuryData.minprice),
                maxstock: parseInt(QuryData.maxstock),
                minstock: parseInt(QuryData.minstock),
            } as { [key: string]: any };

            const dynamicPipeline: any = [];
            dynamicPipeline.push(
                  {
                    $lookup: {
                      from: "categories",
                      localField: "category",
                      foreignField: "_id",
                      as: "categoryDetails",
                    },
                  },
                  {
                    $unwind: "$categoryDetails",
                  },
                  {
                    $project: {
                      category: "$categoryDetails.name",
                      name :1,
                      description : 1,
                      productimage : 1,
                      price :1,
                      stock :1,
                    },
                  },
            );
            let andQueries = {};
            for (let key in requestFilter) {
                if (requestFilter[key]) {
                    if (key == "category") {
                        andQueries = {
                            ...andQueries,
                            [key]: requestFilter[key],
                        };
                    }

                    if (key == "minprice" || key == "minprice") {
                        if (requestFilter.maxPrice && requestFilter.minPrice) {
                            andQueries = {
                                ...andQueries,
                                price: {
                                    $lt: requestFilter.maxPrice,
                                    $gt: requestFilter.minPrice,
                                },
                            };
                        } else {
                            key == "minprice"
                                ? (andQueries = {
                                    ...andQueries,
                                    price: { $lt: requestFilter[key as string] },
                                })
                                : {};
                            key == "minprice"
                                ? (andQueries = {
                                    ...andQueries,
                                    price : { $gt: requestFilter[key as string] },
                                })
                                : {};
                        }
                    }
                    if (key == "maxstock" || key == "minstock") {
                        if (requestFilter.maxPrice && requestFilter.minPrice) {
                            andQueries = {
                                ...andQueries,
                                stock: {
                                    $lt: requestFilter.maxPrice,
                                    $gt: requestFilter.minPrice,
                                },
                            };
                        } else {
                            key == "maxstock"
                                ? (andQueries = {
                                    ...andQueries,
                                    stock: { $lt: requestFilter[key as string] },
                                })
                                : {};
                            key == "minstock"
                                ? (andQueries = {
                                    ...andQueries,
                                    stock: { $gt: requestFilter[key as string] },
                                })
                                : {};
                        }
                    }
                }
            }

            let orQueries = [{}];
            if (QuryData.search != null) {
                
                const searchRegex = new RegExp(`.*${QuryData.search}.*`, "i");
                orQueries = [
                    { name: searchRegex },
                    { description: searchRegex },
                ];
            }

            dynamicPipeline.push({
                $match: {
                    $and: [andQueries],
                    $or: orQueries,
                },
            });

            const result = await Product.aggregate(dynamicPipeline);

            return {
                statuscode: statuscode.ok,
                Content: {
                    result,
                },
            };
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