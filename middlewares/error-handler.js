const errorHandler = (err, req, res, next) => {
  // console.error(err);
  console.error("Error caught by errorHandler:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred";

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
