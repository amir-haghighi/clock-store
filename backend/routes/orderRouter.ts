import { Router } from "express"
import { getOrder, postOrder } from "../controllers/orderController.js"

const orderRouter = Router()


orderRouter.route("/").get(getOrder).post(postOrder)

export default orderRouter