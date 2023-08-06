import { Request, Response } from 'express';
import { MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';
import { Recipe } from '../types';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as MongoClientOptions;

const updateRecipe = async (req: Request, res: Response) => {
    const client = new MongoClient(MONGO_URI, options);
    const dbName = 'cobbler';
    const collectionName = 'recipes';

    const { _id, ...updatedRecipe }: Recipe = req.body.updatedRecipe;

    const updatedRecipeId = new ObjectId(req.body.updatedRecipe._id);

    console.log('Got updatedRecipeId: ');
    console.log(updatedRecipeId.toString());

    try {
        await client.connect();
        const db = client.db(dbName);
        console.log('Connected to DB:' + dbName);
        console.log('Updating recipe...');

        const resultOfUpdate = await db
            .collection(collectionName)
            .updateOne({ _id: updatedRecipeId }, { $set: updatedRecipe });

        if (resultOfUpdate.modifiedCount !== 1) {
            throw new Error('Error updating recipe');
        }

        return res.status(201).json({
            httpStatus: 201,
            recipe: { _id, ...updatedRecipe },
        });
    } catch (error: any) {
        console.log('updateRecipe caught error: ');
        console.log(error.message);
        return res.status(500).json({ httpStatus: 500, error: error.message });
    } finally {
        client.close();
        console.log('Disconnected.');
    }
};

export default updateRecipe;
