import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import createUserInDb from './handlers/createUserInDb';
import getRecipesByIds from './handlers/getRecipesByIds';
import getUserProfileById from './handlers/getUserProfileById';
import getRecipeById from './handlers/getRecipeById';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../../frontend/build')));

app.post('/api/createUserInDb', createUserInDb);
app.post('/api/getRecipesByIds', getRecipesByIds);
app.post('/api/getRecipeById', getRecipeById);
app.post('/api/getUserProfileById', getUserProfileById);

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
});

app.listen(port, () => {
    console.log(`*** Server is running on port ${port} ***`);
});
