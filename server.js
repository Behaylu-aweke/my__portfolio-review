import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import userRouter from "./routes/user.js";

app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']

}));
app.use(express.urlencoded({ extended: true }));

app.use("/auth/user", userRouter); app.listen(process.env.Port, console.log("server listining on port " ,process.env.Port));