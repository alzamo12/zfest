const sendResponse = (res, statusCode, message, data) => {
    return res.status(statusCode).send({
        success: true,
        message: message,
        data: data
    })
};

export default sendResponse