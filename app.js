import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import router from './server/routes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: 'false ' }));
app.use(morgan('dev'));

app.use(router);

export default app;
