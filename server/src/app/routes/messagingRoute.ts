import { Router } from "express";
import { protect } from "#app/middlewares/auth.js";
import { validateSchema } from "#app/middlewares/validate.js";
import { sendMessageSchema, startConversationSchema } from "#app/validators/messageValidators.js";
import {
  listConversations,
  startConversation,
  getConversation,
  sendMessage,
  getUnreadCount,
} from "#app/controllers/messagingController.js";

const router = Router();

router.use(protect);

router.get("/conversations", listConversations);
router.post("/conversations", validateSchema(startConversationSchema), startConversation);
router.get("/conversations/:id", getConversation);
router.post("/conversations/:id/messages", validateSchema(sendMessageSchema), sendMessage);
router.get("/unread-count", getUnreadCount);

export default router;
