import { Router } from "express";
import authRouter from "./authRoute.js";
import usersRouter from "./usersRoute.js";
import exampleRouter from "./exampleRoute.js";
import paymentRouter from "./paymentRoute.js";
import notificationsRouter from "./notificationsRoute.js";
import subscriptionsRouter from "./subscriptionsRoute.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/example", exampleRouter);
router.use("/users", usersRouter);
router.use("/payments", paymentRouter);
router.use("/notifications", notificationsRouter);
router.use("/subscriptions", subscriptionsRouter);

export default router;
