import { Router } from "express";
import { getUsers, getMe, updateMe, changePassword } from "../controllers/userController.js";

import { isUserAdmin, protect } from "../controllers/protect.js";

const userRouter = Router();

userRouter.route("/").get(protect, isUserAdmin, getUsers)
userRouter.route("/me").get(protect, getMe)
userRouter.route("/me").patch(protect, updateMe)
userRouter.route("/me/password").patch(protect, changePassword);

export default userRouter