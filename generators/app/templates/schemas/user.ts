import { prop, Typegoose } from "typegoose";

export default class User extends Typegoose {
  @prop({ required: [true, "The name is required."], unique: true, index: true })
  public name!: string;

  @prop({ required: [true, "The passord is required."] })
  public password!: string;
}
