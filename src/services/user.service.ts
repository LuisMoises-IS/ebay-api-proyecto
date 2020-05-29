import{Request,Response} from "express";
import { MongooseDocument } from "mongoose";

import {User, IUser } from "../models/user.model"

class UserHelpers{

    GetUser(filter: any):Promise<IUser>{        
        return new Promise<IUser>( (resolve) => {
            User.find(filter,(err:Error,User:IUser)=>{
                if(err){
                    console.log(err);
                }else{
                    resolve(User);
                }
            }); 
        });
    }
}

export class UserService extends UserHelpers{

    public getAll(req:Request, res:Response){
        User.find({},(err:Error, users: MongooseDocument)=>{
            if(err){
                res.status(401).send(err);
            }else{
                res.cookie("val","uayeb");
                res.status(200).json(users);
            }
            
        });
    }
    
    

    public async NewOne(req: Request, res: Response){        
        const u = new User(req.body);
        const old_user:any = await super.GetUser({name:u.name});

        console.log(u);
        console.log(req.body);

        if( old_user != u ){
            await u.save((err:Error, User: IUser)=>{
                if(err){
                    res.status(401).send(err);
                }else{
                    res.status(200).json( User? {successed:true, User: User } : {successed:false} );
                }            
            });
        }else{
            res.status(200).json({successed:false});
        } 
    }


    public async deleteOne(req:Request, res:Response){
        User.findByIdAndDelete(req.params.id,(err:Error)=>{
            if(err){
                res.status(401).json({successed:false, message:"server got an error, contact support if this error is still happening"});
            }else{
                res.status(200).json({successed:true,message:"User deleted successfully"});
            }
        });
    }

    public async getOne(req:Request, res:Response){
        const user:any = await super.GetUser({_id:req.params.id});
        res.status(200).json(user[0]);
    }






}