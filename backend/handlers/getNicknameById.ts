import { Request, Response } from 'express';
import { MongoClient, MongoClientOptions, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
} as MongoClientOptions;

const getNicknameById = async (req: Request, res: Response) => {
    const client = new MongoClient(MONGO_URI, options);
    const dbName = 'cobbler';
    const collectionName = 'users';

    const userId: string = req.body.userId;

    try {
        await client.connect();
        const db = client.db(dbName);
        console.log('Connected to DB:' + dbName);
        console.log('run getNicknameById: ' + userId);

        const user = await db
            .collection(collectionName)
            .findOne({ _id: new ObjectId(userId) });

        if (user) {
            return res
                .status(200)
                .json({ httpStatus: 200, nickname: user.nickname });
        } else {
            throw new Error('Error finding nickname');
        }
    } catch (error: any) {
        console.log('getNicknameById caught error: ');
        console.log(error.message);
        return res.status(500).json({ httpStatus: 500, error: error.message });
    } finally {
        client.close();
        console.log('Disconnected.');
    }
};

export default getNicknameById;
