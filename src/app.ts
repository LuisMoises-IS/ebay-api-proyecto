import express,{Application} from "express";

import {CategoryController} from "./controllers/category.controller";
import {ProductController} from "./controllers/product.controller";

import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env") });

class App{
    public app: Application;    

    public category_controller: CategoryController;
    public product_controller: ProductController;

    constructor(){        
        this.app = express();
        
        this.setConfig();
        this.setMongoDBConfig();

        this.category_controller = new CategoryController(this.app);
        this.product_controller = new ProductController(this.app);
        
    }
    private setConfig(){
        this.app.use(bodyParser.json({limit:"50mb"}));
        this.app.use(bodyParser.urlencoded({limit:"50mb", extended:true}));
        this.app.use(cors());        
    }
    private setMongoDBConfig(){
        mongoose.Promise = global.Promise;
        
        mongoose.connect(process.env.MONGO_URI!,{ useNewUrlParser:true, useUnifiedTopology: true }, (err:any)=>{
            if(err){
                console.log(err.message);
            }else{
                console.log("Conexion exitosa");
            }
        });
    }
}

export default new App().app;