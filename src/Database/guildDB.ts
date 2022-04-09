import mongoose, { Schema } from 'mongoose';

export interface Guild {
    id: string,
}

const guildSchema = new Schema<Guild>({
  id: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  }
});

export default mongoose.model('guild', guildSchema);