import { response } from "express";
import { badRequest, internalServerError } from "../middlewares/handle_error";
import * as services from "../services";
const cloudinary = require('cloudinary').v2;

import {
    bid,
    title,
    price,
    available,
    category_code,
    image,
    bids,
    filename,
    description
} from "../helpers/joi_schema";
import Joi from "joi";

export const getBooks = async (req, res) => {
    try {
        const response = await services.getBooks(req.query);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};

export const createNewBook = async (req, res) => {
    try {
        const fileData = req.file;

        const { error } = Joi.object({
            title,
            image,
            category_code,
            price,
            available,
            description
        }).validate({ ...req.body, image: fileData?.path });
        if (error) {
            if (fileData) {
                cloudinary.uploader.destroy(fileData.filename)
            }
            return badRequest(error.details[0].message, res);
        }
        const response = await services.createNewBook(req.body, fileData);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error in createNewBook:", error);
        return internalServerError(res);
    }
};

export const updateBook = async (req, res) => {
    try {
        const fileData = req.file;
        const { error } = Joi.object({
            bid
        }).validate({bid: req.body.bid});
        if (error) {
            if (fileData) {
                cloudinary.uploader.destroy(fileData.filename)
            }
            return badRequest(error.details[0].message, res);
        }
        const response = await services.updateBook(req.body, fileData);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};

export const deleteBook = async (req, res) => { 
    try {
        const { error } = Joi.object({
            bids, filename
        }).validate(req.query);
        if (error) {
            return badRequest(error.details[0].message, res);
        }
        const response = await services.deleteBook(req.query.bids, req.query.filename);
        return res.status(200).json(response);
    } catch (error) {
        return internalServerError(res);
    }
};