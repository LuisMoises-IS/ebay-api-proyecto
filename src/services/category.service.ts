import {Request,Response} from "express";

import {Category, ICategory} from "../models/category.model";
import {ProductService} from "./product.service";                //pendiente

import { MongooseDocument } from "mongoose";


class CategoryHelpers{

    GetCategory(filter: any):Promise<ICategory>{        
        return new Promise<ICategory>( (resolve) => {
            Category.find(filter,(err:Error,category:ICategory)=>{
                if(err){
                    console.log(err);
                }else{
                    resolve(category);
                }
            }); 
        });
    }
}


export class CategoryService extends CategoryHelpers{

    public getAll(req:Request, res:Response){
        Category.find({},(err:Error, categories: MongooseDocument)=>{
            if(err){
                res.status(401).send(err);
            }else{
                res.cookie("val","uayeb");
                res.status(200).json(categories);
            }
            
        });
    }

    public async getOne(req:Request, res:Response){
        const cat:any = await super.GetCategory({_id:req.params.id});
        res.status(200).json(cat);
    }

    public getAllWLanguage(req:Request, res:Response){                                                          //pendiente

        Category.aggregate([{
            "$lookup":{
                from: "products",
                localField:"_id",
                foreignField:"category",
                as: "l"
            }
        }],(err:Error,data:any)=>{
            if(err){
                res.status(401).send(err);
            }else{
                res.status(200).json(data);
            }
        })

    }

    public async NewOne(req: Request, res: Response){        
        const c = new Category(req.body);
        const old_cat:any = await super.GetCategory({name:c.name});

        if( old_cat.length === 0 ){
            await c.save((err:Error, category: ICategory)=>{
                if(err){
                    res.status(401).send(err);
                }else{
                    res.status(200).json( category? {successed:true, category: category } : {successed:false} );
                }            
            });
        }else{
            res.status(200).json({successed:false});
        }        

    }

    public async deleteOne(req: Request, res: Response){                                                //pendiente
        const product_service: ProductService = new ProductService();
        const products:any = await product_service.GetProduct({category: req.params.id});

        if( products.length > 0 ){
            res.status(200).json({successed:false});
        }else{

            Category.findByIdAndDelete(req.params.id,(err:Error)=>{
                if(err){
                    res.status(401).send({successed:false});
                }else{
                    res.status(200).json({successed:true});
                }
            });

        }
    }

}
