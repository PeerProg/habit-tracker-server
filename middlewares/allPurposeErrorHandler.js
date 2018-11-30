// eslint-disable-next-line no-unused-vars
export default (error, req, res, next) => {
  res.status(error.status);
  res.json({
    error: {
      message: error.message
    }
  });
};
