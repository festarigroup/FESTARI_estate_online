import { Router } from "express";
import authRouter from "./authRoute.js";
import usersRouter from "./usersRoute.js";
import exampleRouter from "./exampleRoute.js";
import paymentRouter from "./paymentRoute.js";
import notificationsRouter from "./notificationsRoute.js";
import subscriptionsRouter from "./subscriptionsRoute.js";
import propertiesRouter from "./propertiesRoute.js";
import hotelsRouter from "./hotelsRoute.js";
import artisansRouter from "./artisansRoute.js";
import inquiriesRouter from "./inquiriesRoute.js";
import feedRouter from "./feedRoute.js";
import socialRouter from "./socialRoute.js";
import messagingRouter from "./messagingRoute.js";
import dashboardRouter from "./dashboardRoute.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/example", exampleRouter);
router.use("/users", usersRouter);
router.use("/payments", paymentRouter);
router.use("/notifications", notificationsRouter);
router.use("/subscriptions", subscriptionsRouter);
router.use("/properties", propertiesRouter);
router.use("/hotels", hotelsRouter);
router.use("/artisans", artisansRouter);
router.use("/common", inquiriesRouter);
router.use("/feed", feedRouter);
router.use("/social", socialRouter);
router.use("/messages", messagingRouter);
router.use("/dashboard", dashboardRouter);

export default router;
