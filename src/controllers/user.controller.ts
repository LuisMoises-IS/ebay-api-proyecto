import {Application} from "express";
import {UserService} from "../services/user.service";

export class UserController{
    private User_service: UserService;
    constructor(private app: Application){
        this.User_service = new UserService();
        this.routes();
    }
    private routes(){
            
        this.app.route("/users").get(this.User_service.getAll);

        this.app.route("/user").post(this.User_service.NewOne);

        this.app.route("/user/:id")
        .delete(this.User_service.deleteOne)
        .get(this.User_service.getOneUser)
        
    }
}