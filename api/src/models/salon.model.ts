import mongoose, { Schema, Document } from "mongoose";

export interface ISalon extends Document {
  name: string;
  password?: string;
  code: string; // ID du salon
  createdBy: string; // ID de l'utilisateur créateur
  participants: string[]; // Tableau d'ID d'utilisateurs participants
  nbMaxParticipants: number; // Nombre maximum de participants
  dateAutoDestruction: number; // Date d'auto-destruction du salon
  messages: {
    sender: { type: Schema.Types.ObjectId; ref: "User" };
    content: string;
    timestamp: Date;
  }[];
}

const salonSchema = new Schema({
  name: { type: String, required: true },
  password: { type: String },
  code: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  nbMaxParticipants: { type: Number },
  dateAutoDestruction: { type: Number },

  messages: [
    {
      sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model<ISalon>("Salon", salonSchema);
