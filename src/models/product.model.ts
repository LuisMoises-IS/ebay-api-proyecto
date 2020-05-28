import mongoose from "mongoose";

import {ICategory} from "./category.model";

export interface IProducts extends mongoose.Document{
    img: string;
    name: string;
    description: string;
    price: number;
    category: ICategory;
}

const ProductSchema = new mongoose.Schema({
    img: {type:String,required:true},
    name:{type:String,required:true},
    description:{type:String,required:true},
    price: {type:Number, required:true},
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
});

export const Product = mongoose.model<IProducts>("Product",ProductSchema);