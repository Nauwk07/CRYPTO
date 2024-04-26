import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  surname: string;
  email: string;
  password: string;
  accessToken: string;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    default: null,
  },
});

const User = mongoose.model("User", UserSchema);
export default User;