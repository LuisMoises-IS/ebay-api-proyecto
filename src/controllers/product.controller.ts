import {Application} from "express";
import {ProductService} from "../services/product.service";

export class ProductController{
    private Product_service: ProductService;
    constructor(private app: Application){
        this.Product_service = new ProductService();
        this.routes();
    }
    private routes(){
            
        this.app.route("/products").get(this.Product_service.getAll);

        this.app.route("/products/category/:id").get(this.Product_service.getByCategory);

        this.app.route("/product").post(this.Product_service.NewOne);

        this.app.route("/product/:id")
        .delete(this.Product_service.deleteOne)
        .get(this.Product_service.getOne)
        .put(this.Product_service.updateOne);
        
    }
}