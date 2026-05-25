import express from "express"
import userRouter from "./routes/userRouter.js";
import mongoose from "mongoose";
import configDotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter.js";
import cors from "cors"
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

configDotenv.config({ path: "./config.env" })
app.use("/api/v1/users", userRouter)
app.use("/api/v1/auth", authRouter)

mongoose
    .connect("mongodb://127.0.0.1:27017/clock-store")
    .then(() => console.log("db connected successfully!"));


const PORT = 4000
app.listen(PORT, () => {
    console.log("server is running on the port: ", PORT)
})
