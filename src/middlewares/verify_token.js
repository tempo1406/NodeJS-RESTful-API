import { notAuth } from "./handle_error";
import jwt, { TokenExpiredError } from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return notAuth("Required authorization token", res);
    }
    const accessToken = token.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            const isChecked = err instanceof TokenExpiredError;
            if (!isChecked) {
                return notAuth("Token invalid", res, isChecked);
            }
            if (isChecked) {
                return notAuth("Token expired", res, isChecked);
            }
        }
        req.user = user;
        next();
    });
};

export default verifyToken;
