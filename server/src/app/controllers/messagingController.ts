import { Request, Response } from "express";
import messagingService from "#app/services/messagingService.js";
import notificationsService from "#app/services/notificationsService.js";
import { asyncErrorHandler } from "#app/utils/asyncErrorHandler.js";
import CustomError from "#app/utils/CustomError.js";
import { requiredRouteParam } from "#app/utils/routeParams.js";
import { parsePaginationParams } from "#app/utils/pagination.js";

export const listConversations = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const conversations = await messagingService.listForUser(req.user.id);
  return res.status(200).json({ success: true, data: conversations });
});

export const startConversation = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const participantId = requiredRouteParam(req.body.participant_id, "participant_id");
  if (participantId === req.user.id) throw new CustomError("Cannot start a conversation with yourself", 400);

  const conversation = await messagingService.findOrCreateOneToOne(req.user.id, participantId);
  return res.status(201).json({ success: true, data: conversation });
});

export const getConversation = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const isParticipant = await messagingService.isParticipant(id, req.user.id);
  if (!isParticipant) throw new CustomError("Forbidden", 403);

  const { limit, offset } = parsePaginationParams(req.query);
  const [conversation, participants, messages] = await Promise.all([
    messagingService.getById(id),
    messagingService.getParticipants(id),
    messagingService.getMessages(id, limit, offset),
  ]);

  if (!conversation) throw new CustomError("Conversation not found", 404);

  return res.status(200).json({ success: true, data: { ...conversation, participants, messages } });
});

export const sendMessage = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const id = requiredRouteParam(req.params.id, "id");

  const isParticipant = await messagingService.isParticipant(id, req.user.id);
  if (!isParticipant) throw new CustomError("Forbidden", 403);

  const message = await messagingService.sendMessage({
    conversation_id: id,
    sender_id: req.user.id,
    body: req.body.body,
  });

  const participants = await messagingService.getParticipants(id);
  const recipients = participants.filter((participant) => participant.id !== req.user!.id);
  for (const recipient of recipients) {
    notificationsService
      .notify({
        recipientId: recipient.id,
        actorId: req.user.id,
        verb: "message",
        targetType: "conversation",
        targetId: id,
        channel: "in_app",
        title: "New message",
        body: "You have a new message.",
      })
      .catch(() => {});
  }

  return res.status(201).json({ success: true, data: message });
});

export const getUnreadCount = asyncErrorHandler(async (req: Request, res: Response) => {
  if (!req.user?.id) throw new CustomError("Unauthorized", 401);
  const count = await messagingService.getUnreadCount(req.user.id);
  return res.status(200).json({ success: true, data: { count } });
});
