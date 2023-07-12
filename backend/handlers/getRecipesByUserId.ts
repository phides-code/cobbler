import { Request, Response } from 'express';
import { MongoClient, MongoClientOptions } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as MongoClientOptions;

const getRecipesByUserId = async (req: Request, res: Response) => {
    const client = new MongoClient(MONGO_URI, options);
    const dbName = 'cobbler';
    const collectionName = 'recipes';

    const userId: string = req.body.userId;

    try {
        await client.connect();
        const db = client.db(dbName);
        console.log('Connected to DB:' + dbName);

        const recipes = await db
            .collection(collectionName)
            .find({ authorId: userId })
            .toArray();

        if (recipes) {
            return res.status(200).json({ httpStatus: 200, data: recipes });
        } else {
            throw new Error('Error finding recipes');
        }
    } catch (error: any) {
        console.log('getRecipesByUserId caught error: ');
        console.log(error.message);
        return res.status(500).json({ httpStatus: 500, data: error.message });
    } finally {
        client.close();
        console.log('Disconnected.');
    }
};

export default getRecipesByUserId;
