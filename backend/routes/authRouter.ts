import { Router } from "express";
import { logout, login, signup, forgotPassword, changePasswordForgotten } from "../controllers/authControllers.js";
import { refreshAccessToken } from "../controllers/refreshTokens.js";

const authRouter = Router();

authRouter.route("/signup").post(signup)
authRouter.route("/login").post(login)
authRouter.route("/logout").post(logout)
authRouter.route("/refresh-token").post(refreshAccessToken);
authRouter.route("/forgot-password").post(forgotPassword);
authRouter.route("/reset-password").post(changePasswordForgotten);


export default authRouter