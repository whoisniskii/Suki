import mongoose, { Schema } from 'mongoose';

export interface Guild {
  guildID: string;
  lang: string;
  forever: boolean;
}

const guildSchema = new Schema<Guild>({
  guildID: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  forever: {
    type: mongoose.SchemaTypes.Boolean,
    default: false,
    required: true,
  },
});

export default mongoose.model('guild', guildSchema);
