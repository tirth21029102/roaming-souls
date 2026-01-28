import AppError from '../utilities/appError.js';

// DEV ERROR
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
    errCode: err.code,
    errSqlMsg: err.sqlMessage,
    errProblamaticQuery: err.sql,
  });
};

// PROD ERROR
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR   ', err);

    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.code = err.code || 'no error code exists';
  err.sqlMessage = err.sqlMessage || 'no problem in sql ';
  err.sql = err.sql || 'no problamatic sql';

  if (err.code === '23505') {
    err = new AppError('Duplicate field value', 400);
  }
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};
