import express from 'express';

const router = express.Router();

router.route('/')
  .get((req, res) => {
    res.status(200).json({
      message: 'Welcome to the habit tracker application'
    });
  });

export default router;
