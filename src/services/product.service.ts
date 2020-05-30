import {Request,Response} from "express";

import {Product, IProducts} from "../models/product.model";
import {CategoryService} from "./category.service";

import { MongooseDocument } from "mongoose";


class ProductHelpers{

    GetProduct(filter: any):Promise<IProducts>{        
        return new Promise<IProducts>( (resolve) => {
            Product.find(filter,(err:Error,Product:IProducts)=>{
                if(err){
                    console.log(err);
                }else{
                    resolve(Product);
                }
            }); 
        });
    }
}


export class ProductService extends ProductHelpers{
    
    public getAll(req:Request, res:Response){               //pendiente
        Product.aggregate([
            {
                "$lookup":{
                    from: "categories",
                    localField:"category",
                    foreignField:"_id",
                    as: "category"
                }
            }
        ],(err:Error, data:any)=>{
            if(err){
                res.status(401).send(err);
            }else{
                res.status(200).json(data);
            } 
          })
    }

    
    public async NewOne(req: Request, res: Response){        
        const p = new Product(req.body);
        const old_prod:any = await super.GetProduct({name:p.name});

        console.log(p);
        console.log(req.body);

        if( old_prod != p ){
            await p.save((err:Error, Product: IProducts)=>{
                if(err){
                    res.status(401).send(err);
                }else{
                    res.status(200).json( Product? {successed:true, Product: Product } : {successed:false} );
                }            
            });
        }else{
            res.status(200).json({successed:false});
        } 
    }
    /*
    public async NewOne(req: Request, res: Response){
        const prod = new Product(req.body);

        await prod.save((err:Error, Cart:IProducts)=>{
            if(err){
                res.status(401).send(err);
            }else{
                res.status(200).json( Cart? {successed:true, Cart: Cart } : {successed:false} );          
            }
        });
    }*/


    public async deleteOne(req:Request, res:Response){
        Product.findByIdAndDelete(req.params.id,(err:Error)=>{
            if(err){
                res.status(401).json({successed:false, message:"server got an error, contact support if this error is still happening"});
            }else{
                res.status(200).json({successed:true,message:"Product deleted successfully"});
            }
        });
    }

    public async getOne(req:Request, res:Response){
        const pro:any = await super.GetProduct({_id:req.params.id});
        res.status(200).json(pro[0]);
    }

    public async updateOne(req:Request, res:Response){       
        const old_pro:any = await super.GetProduct({
            name:req.body.name,
            _id: { $nin: [req.params.id] }
        });

        if( old_pro.length === 0 ){

            Product.findByIdAndUpdate(req.params.id,req.body,(err:Error)=>{
                if(err){
                    res.status(401).json({successed:false, message:"server got an error, contact support if this error is still happening"});
                }else{
                    res.status(200).json({successed:true,message:"Product updated successfully"});
                }
            });

        }else{
            res.status(200).json({successed:false});
        } 
    }

    public async getByCategory(req:Request, res:Response){
        const pro:any = await super.GetProduct({category:req.params.id});
        res.status(200).json(pro);
    }

}
