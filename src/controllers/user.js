import { response } from "express";
import { badRequest, internalServerError } from "../middlewares/handle_error";
import * as services from "../services";

export const getCurrent = async (req, res) => {
    try {
        const {id} = req.user;
        const response = await services.getOne(id);
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}