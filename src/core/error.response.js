'use strict'
const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: 'conflict Error'
}

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

module.exports = {
    ConflictRequestError,
    BadRequestError
}