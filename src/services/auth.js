import db from "../models";
import bcrypt from "bcrypt";
import { ref } from "joi";
import jwt from "jsonwebtoken";
import { notAuth } from "../middlewares/handle_error";

const hashPassword = (password) =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(8));

export const register = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.findOrCreate({
                where: { email },
                defaults: {
                    email,
                    password: hashPassword(password),
                },
            });
            const accessToken = response[1]
                ? jwt.sign(
                      {
                          id: response[0].id,
                          email: response[0].email,
                          role_code: response[0].role_code,
                      },
                      process.env.JWT_SECRET,
                      {
                          expiresIn: "5s",
                      }
                  )
                : null;

            const refreshToken = response[1]
                ? jwt.sign(
                      {
                          id: response[0].id,
                      },
                      process.env.JWT_SECRET_REFRESH_TOKEN,
                      {
                          expiresIn: "15d",
                      }
                  )
                : null;

            resolve({
                err: response[1] ? 0 : 1,
                mes: response[1] ? "Register success" : "Email already exists",
                access_token: accessToken
                    ? `Bearer ${accessToken}`
                    : accessToken,
                refresh_token: refreshToken,
            });
            if (refreshToken) {
                await db.User.update(
                    { refresh_token: refreshToken },
                    { where: { id: response[0].id } }
                );
            }
        } catch (error) {
            reject(error);
        }
    });

export const login = ({ email, password }) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.findOne({
                where: { email },
                raw: true,
            });
            const isChecked =
                response && bcrypt.compareSync(password, response.password);
            const accessToken = isChecked
                ? jwt.sign(
                      {
                          id: response.id,
                          email: response.email,
                          role_code: response.role_code,
                      },
                      process.env.JWT_SECRET,
                      {
                          expiresIn: "5s",
                      }
                  )
                : null;

            const refreshToken = isChecked
                ? jwt.sign(
                      {
                          id: response.id,
                      },
                      process.env.JWT_SECRET_REFRESH_TOKEN,
                      {
                          expiresIn: "60s",
                      }
                  )
                : null;
            resolve({
                err: accessToken ? 0 : 1,
                mes: accessToken
                    ? "Login success"
                    : response
                    ? "Wrong password"
                    : "Email not found",
                access_token: accessToken
                    ? `Bearer ${accessToken}`
                    : accessToken,
                refresh_token: refreshToken,
            });
            if (refreshToken) {
                await db.User.update(
                    { refresh_token: refreshToken },
                    { where: { id: response.id } }
                );
            }
        } catch (error) {
            reject(error);
        }
    });

export const refreshToken = (refresh_token) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.User.findOne({
                where: { refresh_token },
            });
            if (response) {
                jwt.verify(
                    refresh_token,
                    process.env.JWT_SECRET_REFRESH_TOKEN,
                    (err) => {
                        if (err) {
                            resolve({
                                err: 1,
                                mes: "Refresh token invalid, required login",
                            });
                        } else {
                            const accessToken = jwt.sign(
                                {
                                    id: response.id,
                                    email: response.email,
                                    role_code: response.role_code,
                                },
                                process.env.JWT_SECRET,
                                {
                                    expiresIn: "5s",
                                }
                            );
                            resolve({
                                err: accessToken ? 0 : 1,
                                mes: accessToken
                                    ? "Refresh token success"
                                    : "Refresh token failed",
                                access_token: accessToken
                                    ? `Bearer ${accessToken}`
                                    : accessToken,
                                refresh_token: refresh_token,
                            });
                        }
                    }
                );
            }
        } catch (error) {
            reject(error);
        }
    });
