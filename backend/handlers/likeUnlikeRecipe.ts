import { Request, Response } from 'express';
import { MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';
import { LikeUnlikeRecipeProps } from '../types';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as MongoClientOptions;

const likeUnlikeRecipe = async (req: Request, res: Response) => {
    const client = new MongoClient(MONGO_URI, options);
    const dbName = 'cobbler';
    const collectionName = 'recipes';

    const recipeUpdate: LikeUnlikeRecipeProps = req.body;

    try {
        await client.connect();
        const db = client.db(dbName);
        console.log('Connected to DB:' + dbName);
        console.log('run likeUnlikeRecipe: ');
        console.log(recipeUpdate.recipeId);

        const updateResult = await db
            .collection(collectionName)
            .updateOne(
                { _id: new ObjectId(recipeUpdate.recipeId) },
                recipeUpdate.type === 'like'
                    ? { $push: { ['likedBy']: recipeUpdate.userId } }
                    : { $pull: { ['likedBy']: recipeUpdate.userId } }
            );

        if (updateResult.matchedCount === 1) {
            const updatedRecipe = await db
                .collection(collectionName)
                .findOne({ _id: new ObjectId(recipeUpdate.recipeId) });

            await db
                .collection('users')
                .updateOne(
                    { _id: new ObjectId(recipeUpdate.userId) },
                    recipeUpdate.type === 'like'
                        ? { $push: { ['likedRecipes']: recipeUpdate.recipeId } }
                        : { $pull: { ['likedRecipes']: recipeUpdate.recipeId } }
                );

            return res.status(200).json({ httpStatus: 200, updatedRecipe });
        } else {
            throw new Error('Error finding recipe');
        }
    } catch (error: any) {
        console.log('likeUnlikeRecipe caught error: ');
        console.log(error.message);
        return res.status(500).json({ httpStatus: 500, error: error.message });
    } finally {
        client.close();
        console.log('Disconnected.');
    }
};

export default likeUnlikeRecipe;
