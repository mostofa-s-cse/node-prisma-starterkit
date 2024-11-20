import {AppError} from "../middlewares/errorHandler";

/**
 * Validates the format of an email address using a regular expression.
 * @param email - The email address to be validated
 * @throws AppError if the email is invalid
 */
export const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        throw new AppError("Invalid email format", 400);
    }
};
