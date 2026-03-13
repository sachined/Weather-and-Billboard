// pages/api/weather/history.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import WeatherHistory from '@/models/WeatherHistory';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // 1. Authorization Check for write operations (POST, DELETE)
    if (req.method === 'DELETE' && !req.query.city) {
        const isDev = process.env.NODE_ENV === 'development';
        const adminKey = process.env.ADMIN_KEY;
        const providedKey = req.headers['admin-key'] || (req.headers['authorization']?.startsWith('Bearer ') ? req.headers['authorization'].split(' ')[1] : null);

        // Only allow clearing ALL history in development or with a valid admin key.
        if (!isDev && (!adminKey || providedKey !== adminKey)) {
            return res.status(403).json({
                error: 'Unauthorized: Clearing entire history is only allowed in development or with a valid admin-key header.'
            });
        }
    }
        try {
            await dbConnect();
        } catch (e: any) { return res.status(500).json({ error:'Database Connection Error', details: e.message });
            }
    switch (req.method) {
        case 'GET':
            try {
                // Fetch the 5 most recently searched cities
                const history = await WeatherHistory.find({})
                    .sort({searchedAt: -1})
                    .limit(5);

                // Return an array of city name strings
                res.status(200).json(history.map(item => item.cityName));
            } catch (e: any) {
                res.status(500).json({error: 'Failed to fetch history', details: e.message});
            }
            break;

        case 'POST':
            try {
                const {city} = req.body;
                if (!city) {
                    return res.status(400).json({error: 'City name is required'});
                }

                // Upsert: Update the timestamp if it exists, otherwise create it
                const result = await WeatherHistory.findOneAndUpdate(
                    {cityName: city.trim().toUpperCase()},
                    {cityName: city.trim().toUpperCase(), searchedAt: new Date()},
                    {upsert: true, returnDocument: 'after', runValidators: true}
                );

                res.status(200).json({success: true, result});
            } catch (e: any) {
                res.status(500).json({error: 'Failed to update history', details: e.message});
            }
            break;

        case 'DELETE':
            try {
                const {city} = req.query;
                if (typeof city === 'string' && city.trim() !== '') {
                    const result = await WeatherHistory.deleteOne({
                        cityName: city.trim().toUpperCase()
                    });
                    if (result.deletedCount === 0) {
                        return res.status(404).json({error: 'City not found'});
                    }

                    return res.status(200).json({success: true, message: `${city} deleted from history.`});
                } else {
                    await WeatherHistory.deleteMany({});
                    res.status(200).json({success: true, message: 'Cleared all weather search history.'});
                }
            } catch (e: any) {
                    res.status(500).json({error: 'Failed to clear history', details: e.message });
                }
                break;

        default:
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}