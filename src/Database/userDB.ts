import mongoose, { Schema } from 'mongoose';

export interface User {
  id: string;
}

const userSchema = new Schema<User>({
  id: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
});

export default mongoose.model('user', userSchema);
