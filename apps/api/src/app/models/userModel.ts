import { model, Schema, models } from 'mongoose';

const userSchema  = new Schema({
  name:  {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
  },
  friends: {
    type: Array,
    default: []
  }
})

const User = models.User || model("User", userSchema);

export default User
