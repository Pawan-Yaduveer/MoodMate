export default function errorHandler(err, req, res, next) {
  // eslint-disable-next-line no-console
  console.error(err);
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  res.status(statusCode).json({ message });
}


