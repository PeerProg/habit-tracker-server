/* eslint-disable no-unused-vars */
export default (err, req, res, next) => {
  res.status(err.status || 500)
    .json({
      error: {
        message: err.message // Most (All) errors have a "message" property. Should be good.
      }
    });
  // next() can subsequently be added here if we
  // decide to handle some other error in a specific way;
};
