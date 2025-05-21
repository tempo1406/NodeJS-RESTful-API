import {  notAuth } from "./handle_error";
import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return notAuth('Required authorization token', res)
    }
    const accessToken = token.split(' ')[1]
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return notAuth('Invalid token', res)
        }
        req.user = user
        next()
    })
}

export default verifyToken;