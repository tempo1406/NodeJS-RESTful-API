import { raw } from "mysql2";
import db from "../models";
import { Op } from "sequelize";
import { defaults } from "joi";
import { v4 } from "uuid";
const cloudinary = require("cloudinary").v2;

export const getBooks = ({ page, limit, order, name, available, ...query }) =>
    new Promise(async (resolve, reject) => {
        try {
            const queries = {
                raw: true,
                nest: true,
            };
            const offset = !page || +page <= 1 ? 0 : +page - 1;
            const fLimit = +limit || +process.env.LIMIT_BOOK;
            queries.offset = offset * fLimit;
            queries.limit = fLimit;
            if (order) queries.order = [order];
            if (name) query.title = { [Op.substring]: name };
            if (available) query.available = { [Op.between]: available };
            const response = await db.Book.findAndCountAll({
                where: query,
                ...queries,
                attributes: {
                    exclude: ["category_code"],
                },
                include: [
                    {
                        model: db.Category,
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                        as: "categoryData",
                    },
                ],
            });
            resolve({
                err: response ? 0 : 1,
                mes: response ? "Get book success" : "Book not found",
                bookData: response,
            });
        } catch (error) {
            reject(error);
        }
    });

export const createNewBook = (body, fileData) =>
    new Promise(async (resolve, reject) => {
        try {
            const response = await db.Book.findOrCreate({
                where: { title: body?.title },
                defaults: {
                    ...body,
                    id: v4(),
                    image: fileData?.path,
                },
            });
            resolve({
                err: response[1] ? 0 : 1,
                mes: response[1]
                    ? "Create book success"
                    : "Book already exists",
            });
            if (fileData && !response[1]) {
                cloudinary.uploader.destroy(fileData.filename);
            }
        } catch (error) {
            reject(error);
            if (fileData) {
                cloudinary.uploader.destroy(fileData.filename);
            }
        }
    });
