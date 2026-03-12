// Define portfolio schema
import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * Interface representing a single stock position in the portfolio.
 * Extends mongoose.Document to provide built-in database methods.
 */
export interface IPosition extends Document {
  symbol: string;
  shares: number;
  addedAt: string;
}

/**
 * Mongoose Schema for the "Position" collection.
 * This schema enforces the structure used across your API routes and components.
 */
const PositionSchema = new Schema<IPosition>({
  symbol: {
    type: String,
    required: [true, 'Ticker symbol is required (e.g., RKLB)'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  shares: {
    type: Number,
    required: [true, 'Number of shares is required'],
    min: [0, 'Shares cannot be negative'],
  },
  addedAt: {
    type: String,
    required: true,
    // Default value is today's date in YYYY-MM-DD format
    default: () => new Date().toISOString().split('T')[0],
  },
});

/**
 * The Portfolio Position Model.
 *
 * IMPORTANT FOR NEXT.JS:
 * In development, Next.js re-runs the code on every change (HMR).
 * We check if 'mongoose.models.Position' already exists to avoid the
 * "OverwriteModelError" when the model is compiled more than once.
 */
export const Position: Model<IPosition> =
  mongoose.models.Position || mongoose.model<IPosition>('Position', PositionSchema);

export default Position;
