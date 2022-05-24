import mongoose, { Schema } from 'mongoose';

export interface UserDB {
  id: string;
}

const userSchema = new Schema<UserDB>({
  id: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
});

export default mongoose.model('user', userSchema);
