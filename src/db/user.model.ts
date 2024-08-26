import { model, Schema, Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  access_token: string;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, require: true },
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    access_token: { type: String, require: true },
  },
  { timestamps: true }
);

export default model<IUser>("User", UserSchema, "users");
