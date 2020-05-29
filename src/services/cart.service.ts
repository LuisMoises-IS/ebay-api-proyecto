import {Request,Response} from "express";

import {Cart, ICart} from "../models/cart.model"
import { MongooseDocument } from "mongoose";

class CartHelpers{

    GetCart(filter: any):Promise<ICart>{        
        return new Promise<ICart>( (resolve) => {
            Cart.find(filter,(err:Error,Product:ICart)=>{
                if(err){
                    console.log(err);
                }else{
                    resolve(Product);
                }
            }); 
        });
    }
}

export class CartService extends CartHelpers{

    public getAll(req:Request, res:Response){               
        Cart.aggregate([
            {
                "$lookup":{
                    from: "users",
                    localField:"user",
                    foreignField:"_id",
                    as: "user"
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
        const car = new Cart(req.body);

        await car.save((err:Error, Cart:ICart)=>{
            if(err){
                res.status(401).send(err);
            }else{
                res.status(200).json( Cart? {successed:true, Cart: Cart } : {successed:false} );          
            }
        });
    }

    public async deleteOne(req:Request, res:Response){
        Cart.findByIdAndDelete(req.params.id,(err:Error)=>{
            if(err){
                res.status(401).json({successed:false, message:"server got an error, contact support if this error is still happening"});
            }else{
                res.status(200).json({successed:true,message:"Cart deleted successfully"});
            }
        });
    }

    public async getOne(req:Request, res:Response){
        const car:any = await super.GetCart({_id:req.params.id});
        res.status(200).json(car[0]);
    }

    public async getCartByUser(req:Request, res:Response){
        const car:any = await super.GetCart({user:req.params.id});
        res.status(200).json(car);
    }


}

