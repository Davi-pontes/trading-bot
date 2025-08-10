import { Router } from "express";
import { UserRouter } from "./routes/userBot.routes";

const router = Router();

router.get("/", (_, res) => {res.send("Servidor funcionando!")});

router.use("/user", UserRouter)

export {router}