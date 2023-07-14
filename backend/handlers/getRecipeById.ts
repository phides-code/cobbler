import { Request, Response } from 'express';
import { MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as MongoClientOptions;

const getRecipeById = async (req: Request, res: Response) => {
    const client = new MongoClient(MONGO_URI, options);
    const dbName = 'cobbler';
    const collectionName = 'recipes';

    const recipeId: string = req.body.recipeId;

    const recipeObjectId: ObjectId = new ObjectId(recipeId);

    try {
        await client.connect();
        const db = client.db(dbName);
        console.log('Connected to DB:' + dbName);
        console.log('run getRecipeById: ');
        console.log(recipeId);

        const recipe = await db
            .collection(collectionName)
            .findOne({ _id: recipeObjectId });

        if (recipe) {
            return res.status(200).json({ httpStatus: 200, recipe });
        } else {
            throw new Error('Error finding recipes');
        }
    } catch (error: any) {
        console.log('getRecipeById caught error: ');
        console.log(error.message);
        return res.status(500).json({ httpStatus: 500, error: error.message });
    } finally {
        client.close();
        console.log('Disconnected.');
    }
};

export default getRecipeById;
