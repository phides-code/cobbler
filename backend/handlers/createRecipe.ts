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

const createRecipe = async (req: Request, res: Response) => {
    const client = new MongoClient(MONGO_URI, options);
    const dbName = 'cobbler';
    const collectionName = 'recipes';

    const newRecipe: Partial<Recipe> = req.body.newRecipe;
    console.log('Got new recipe: ');
    console.log(newRecipe);

    try {
        await client.connect();
        const db = client.db(dbName);
        console.log('Connected to DB:' + dbName);
        console.log('Adding new recipe to DB...');

        const resultOfInsert = await db.collection(collectionName).insertOne({
            ...newRecipe,
            likedBy: [],
        });

        if (resultOfInsert.acknowledged) {
            const insertedRecipe = await db.collection(collectionName).findOne({
                _id: new ObjectId(resultOfInsert.insertedId),
            });

            await db.collection('users').updateOne(
                { _id: new ObjectId(newRecipe.authorId) },
                {
                    $push: {
                        ['authoredRecipes']: resultOfInsert.insertedId,
                    },
                }
            );

            return res.status(200).json({
                httpStatus: 200,
                recipe: insertedRecipe,
            });
        } else {
            throw new Error('Error creating recipe');
        }
    } catch (error: any) {
        console.log('createRecipe caught error: ');
        console.log(error.message);
        return res.status(500).json({ httpStatus: 500, error: error.message });
    } finally {
        client.close();
        console.log('Disconnected.');
    }
};

export default createRecipe;
