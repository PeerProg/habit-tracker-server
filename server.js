import app from './app';

const port = process.env.PORT || 9999;

/* eslint-disable no-console */
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
