// models/WeatherHistory.ts
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IWeatherHistory extends Document {
    cityName: string;
    searchedAt: Date;
}

const weatherHistorySchema: Schema = new Schema<IWeatherHistory>({
    cityName: {
        type: String,
        required: [true, 'City name is required'],
        unique: true,
        uppercase: true,
        trim: true,
    },
    searchedAt: {
        type: Date,
        default: Date.now
    },
}, { collection: 'weather_history' });

//The Weather History Model - the same singleton pattern as the Position model for Next.js compatibility.

export const WeatherHistory: Model<IWeatherHistory> =
    mongoose.models.WeatherHistory || mongoose.model<IWeatherHistory>('WeatherHistory', weatherHistorySchema);

export default WeatherHistory;