import { Request, Response } from 'express';
import { MongoClient, MongoClientOptions } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as MongoClientOptions;

const createUserInDb = async (req: Request, res: Response) => {
    console.log('Logging in user: ' + req.body.nickname);

    const client = new MongoClient(MONGO_URI, options);
    const dbName = 'cobbler';
    const collectionName = 'users';
    try {
        await client.connect();
        const db = client.db(dbName);
        console.log('Connected to DB:' + dbName);

        const foundUser = await db
            .collection(collectionName)
            .findOne({ email: req.body.email });

        if (foundUser) {
            console.log('User already in DB');
            return res.status(200).json({
                httpStatus: 200,
                data: foundUser,
            });
        } else {
            console.log('Adding new user to DB...');

            const resultOfInsert = await db
                .collection(collectionName)
                .insertOne({
                    ...req.body,
                    authoredRecipes: [],
                    likedRecipes: [],
                });

            console.log('got resultOfInsert: ');
            console.log(resultOfInsert);
            return res.status(200).json({
                httpStatus: 200,
                data: resultOfInsert,
            });
        }
    } catch (error: any) {
        console.log('createUserInDb caught error: ');
        console.log(error.message);
        return res.status(500).json({ httpStatus: 500, data: error.message });
    } finally {
        client.close();
        console.log('Disconnected.');
    }
};

export default createUserInDb;
