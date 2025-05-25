import express from 'express';
import cors from 'cors';
import innitRoutes from './src/routes';
import dotenv from 'dotenv';
import './connection_database.js';

dotenv.config();

const app = express();
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

innitRoutes(app)

const PORT = process.env.PORT || 8000;
app.listen(PORT, (err) => {
    if (err) {
        console.error(`Error starting server: ${err.message}`);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});