import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
    password: string;
}

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
});

export const User = mongoose.model<IUser>("User", UserSchema);
