import type { ErrorRequestHandler } from 'express';

const errorController: ErrorRequestHandler = (error, _req, res, _next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if (process.env.NODE_ENV === 'development') {

        return res.status(error.statusCode).json({
            status: error.status,
            error: error,
            message: error.message,
            stack: error.stack
        });
    } else if (process.env.NODE_ENV === 'production') {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
        });
    }
};

export default errorController;