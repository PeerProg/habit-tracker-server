import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { userRouter, homeRouter } from './routes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: 'false' }));
app.use(morgan('dev'));
app.use(cors());

const baseRoute = '/api/v1';

// Mount the routers on the app object
app.use(`${baseRoute}/`, homeRouter);
app.use(`${baseRoute}/user`, userRouter);

export default app;
