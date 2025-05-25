import { notAuth } from "./handle_error";

export const isAdmin = (req, res, next) => {
    const {role_code} = req.user;
    if (role_code !== 'R1') return notAuth('Required admin role', res)
    next()
}

export const isCreatorOrAdmin = (req, res, next) => {
    const {role_code} = req.user;
    if (role_code !== 'R1' && role_code !== 'R2') return notAuth('Required Admin or Creator role', res)
    next()
}
