import { response } from "express";
import { badRequest, internalServerError } from "../middlewares/handle_error";
import * as services from "../services";

export const getBooks = async (req, res) => {
    try {
        const response = await services.getBooks(req.query);
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}