const sendError = (res, statusCode, message, err) => {
    return res.status(statusCode || 500).send({
        success: false,
        message: message || 'Internal server Error',
        err: err
    })
};

export default sendError;