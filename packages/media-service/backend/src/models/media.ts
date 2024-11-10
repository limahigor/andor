import mongoose, { type Schema, type Document } from 'mongoose';

export interface IMedia extends Document {
  title: string;
  type: 'Youtube' | 'Torrent' | 'Google Drive';
  channel: 'Nenhum' | 'canal1' | 'canal2';
  link: string;
}

const MediaSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['Youtube', 'Torrent', 'Google Drive'] },
  channel: { type: String, required: true, enum: ['Nenhum', 'canal1', 'canal2'], default: 'Nenhum' },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => /^https?:\/\/.+$/.test(v),
      message: (props: { value: string }) => `${props.value} não é uma URL válida!`,
    },
  },
});

const Media = mongoose.model<IMedia>('Media', MediaSchema);
export default Media;
