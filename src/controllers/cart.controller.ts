import {Application} from "express";
import {CartService} from "../services/cart.service";

export class CartController{
    private Cart_service: CartService;
    constructor(private app: Application){
        this.Cart_service = new CartService();
        this.routes();
    }
    private routes(){
            
        this.app.route("/carts").get(this.Cart_service.getAll);

        this.app.route("/carts/user/:id").get(this.Cart_service.getCartByUser);

        this.app.route("/cart").post(this.Cart_service.NewOne);

        this.app.route("/cart/:id")
        .delete(this.Cart_service.deleteOne)
        .get(this.Cart_service.getOne)
        
    }
}