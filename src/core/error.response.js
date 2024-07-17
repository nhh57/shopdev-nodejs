'use strict'


const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'conflict Error'
}

const {
    StatusCodes,
    ReasonPhrases
} = require('../utils/httpStatusCode')

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT,
                status = StatusCode.FORBIDDEN) {
        super(message);
        this.status = status;
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT,
                status = StatusCode.FORBIDDEN) {
        super(message);
        this.status = status;
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonPhrases.UNAUTHORIZED,
                status = StatusCodes.UNAUTHORIZED) {
        super(message, status);
    }
}

module.exports = {
    ConflictRequestError,
    BadRequestError,
    AuthFailureError
}