import mongoose, { Schema } from 'mongoose';

export interface Guild {
    guildID: string,
}

const guildSchema = new Schema<Guild>({
  guildID: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  }
});

export default mongoose.model('guild', guildSchema);