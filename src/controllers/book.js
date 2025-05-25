import { response } from "express";
import { badRequest, internalServerError } from "../middlewares/handle_error";
import * as services from "../services";
import { title, price, available, category_code, image } from "../helpers/joi_schema";
import Joi from "joi";

export const getBooks = async (req, res) => {
    try {
        const response = await services.getBooks(req.query);
        return res.status(200).json(response)
    } catch (error) {
        return internalServerError(res)
    }
}

export const createNewBook = async (req, res) => {
    try {
       const {error} = Joi.object({ title, image, category_code, price, available }).validate(req.body);
       if (error) return badRequest(error.details[0].message, res);
        const response = await services.createNewBook(req.body);
        return res.status(200).json(response)
    } catch (error) {
        console.error('Error in createNewBook:', error);
        return internalServerError(res)
    }
}