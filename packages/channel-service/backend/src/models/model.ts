import mongoose, { Schema, Document } from 'mongoose';
import { deleteMediasByChannelId } from '../clients/mediaServiceClient.js'; 

export interface IChannel extends Document {
  name: string;
  description: string;
  parentChannel?: IChannel | null; // Canal pai, se existir
  medias: mongoose.Types.ObjectId[]; // Referência aos IDs das mídias associadas
  createdAt: Date;
  updatedAt: Date;
}

const ChannelSchema = new Schema<IChannel>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    parentChannel: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
      default: null,
    },
    medias: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Media',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Middleware para remover mídias associadas ao canal
ChannelSchema.pre('findOneAndDelete', async function (next) {
  const channel = await this.model.findOne(this.getFilter());
  if (channel) {
    try {
      // Chama o media-service para excluir mídias associadas ao canal
      await deleteMediasByChannelId(channel._id.toString());
      console.log('Mídias associadas excluídas pelo media-service.');
    } catch (error) {
      console.error('Erro ao excluir mídias associadas pelo media-service:', error);
      throw new Error('Erro ao excluir mídias associadas.');
    }
  }
  next();
});

const Channel = mongoose.model<IChannel>('Channel', ChannelSchema);

export default Channel;
