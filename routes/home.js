import express from 'express';

const router = express.Router();

router.route('/')
  .get((req, res) => res.send({ message: 'Welcome to the habit tracker application' }));

export default router;
