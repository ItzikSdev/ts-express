import { model, Schema, Document } from "mongoose";

export interface ISource extends Document {
  _id: string;
  name: string;
}

const SourceSchema: Schema = new Schema(
  {
    name: { type: String, require: true },
  },
  { timestamps: true }
);

export default model<ISource>("ISource", SourceSchema, "sources");
