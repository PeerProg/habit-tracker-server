/* eslint-disable no-unused-vars */
export default (error, req, res, next) => {
  return res.status(error.status || 500)
    .json({
      error: {
        message: error.message // Most (All) errors have a "message" property. Should be good.
      }
    });
  // next() can subsequently be added here if we
  // decide to handle some other error in a specific way;
};
