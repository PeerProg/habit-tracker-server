// eslint-disable-next-line no-unused-vars
export default (req, res, next) => {
  const error = new Error('Route not Found');
  res.status(400).json({
    error: {
      message: error.message
    }
  });
};
