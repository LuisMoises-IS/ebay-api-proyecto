import mongoose from "mongoose";
import {IUser} from "./user.model"

export interface ICart extends mongoose.Document {
    user: IUser;
}

const CartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user"}
});

export const Cart = mongoose.model<ICart>("Cart", CartSchema);

