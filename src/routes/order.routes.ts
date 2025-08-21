import { OrderController } from "@/controller/orderController";
import { Router } from "express";

const router = Router();

const controller = new OrderController();

router.get('/:id', controller.getByUserId.bind(controller));

export { router as OrderRouter };