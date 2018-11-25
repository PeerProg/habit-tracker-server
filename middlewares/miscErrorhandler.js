export default (error, req, res) => {
  res.status(error.status || 500)
    .json({
      error: {
        message: error.message
      }
    });
};
