import 'babel-core/register';
import 'babel-polyfill';
import app from './app';

const port = process.env.PORT || 7000;

/* eslint-disable no-console */
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
