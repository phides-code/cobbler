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

const deleteRecipe = async (req: Request, res: Response) => {
    const client = new MongoClient(MONGO_URI, options);
    const dbName = 'cobbler';
    const collectionName = 'recipes';

    const recipeToDelete: Partial<Recipe> = req.body.recipeToDelete;
    const recipeId = recipeToDelete._id?.toString() as string;
    const authorId = new ObjectId(recipeToDelete.authorId as string);
    console.log('Got recipe to delete: ');
    console.log(recipeId);

    const recipeObjectId = new ObjectId(recipeId);

    try {
        await client.connect();
        const db = client.db(dbName);
        console.log('Connected to DB:' + dbName);
        console.log('Deleting recipe from DB...');

        const resultOfDelete = await db.collection(collectionName).deleteOne({
            _id: recipeObjectId,
        });

        if (resultOfDelete.acknowledged) {
            await db.collection('users').updateOne(
                { _id: authorId },
                {
                    $pull: {
                        ['authoredRecipes']: recipeId,
                    },
                }
            );

            const updateObject: Record<string, any> = {
                $pull: { likedRecipes: recipeId },
            };

            await db.collection('users').updateMany({}, updateObject);

            return res.status(200).json({
                httpStatus: 200,
                recipe: resultOfDelete,
            });
        } else {
            throw new Error('Error deleting recipe');
        }
    } catch (error: any) {
        console.log('deleteRecipe caught error: ');
        console.log(error.message);
        return res.status(500).json({ httpStatus: 500, error: error.message });
    } finally {
        client.close();
        console.log('Disconnected.');
    }
};

export default deleteRecipe;
