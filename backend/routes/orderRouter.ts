import { Router } from "express"
import { getOrder } from "../controllers/orderController.js"

const orderRouter = Router()


orderRouter.route("/").get(getOrder)

export default orderRouter