import mongoose, { type Document } from 'mongoose';

export interface IMedia extends Document {
  title: string;
  type: 'Youtube' | 'Torrent' | 'Google Drive';
  channel: 'Nenhum' | 'canal1' | 'canal2';
  link: string;
}

const MediaSchema = new mongoose.Schema<IMedia>({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['Youtube', 'Torrent', 'Google Drive'] },
  channel: { type: String, required: true, enum: ['Nenhum', 'canal1', 'canal2'], default: 'Nenhum' },
  link: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        const {type} = (this); // Declara explicitamente que this é do tipo IMedia
        if (type === 'Torrent') {
          return v.startsWith('magnet:?'); // Valida links magnéticos
        }
        return /^https?:\/\/.+/.test(v); // Valida URLs padrão
      },
      message: (props: { value: string }) =>
        `${props.value} não é um link válido para o tipo selecionado!`,
    },
  },
});

const Media = mongoose.model<IMedia>('Media', MediaSchema);
export default Media;
