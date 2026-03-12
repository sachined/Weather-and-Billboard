import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMessage extends Document {
    name: string;
    email: string;
    message: string;
    submittedAt: Date;
}

const messageSchema: Schema = new Schema<IMessage>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
}, { collection: 'messages' });

/**
 * The Contact Message Model.
 * Logged for backup purposes alongside Formspree emails.
 */
export const Message: Model<IMessage> =
    mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);

export default Message;
