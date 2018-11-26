import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { userRouter, homeRouter } from './routes';
import { routesErrorHandler, allPurposeErrorHandler } from './middlewares';

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

// Unknown routes error handler.
app.use(routesErrorHandler);

// miscellanous error handler
app.use(allPurposeErrorHandler);

export default app;
