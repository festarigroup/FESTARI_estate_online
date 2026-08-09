import { getCurrentUser, getUser, getUserByKey, getUsers, updateUser, acceptTerms, uploadProfileAvatar } from '#app/controllers/usersController.js';
import { protect } from '#app/middlewares/auth.js';
import { uploadAvatarMiddleware } from '#app/middlewares/uploadAvatar.js';
import { Router } from 'express'

const router = Router()
router.get("/", getUsers)
router.get("/find", getUserByKey)
router.get("/me", protect, getCurrentUser)
router.post("/me/accept-terms", protect, acceptTerms)
router.post("/me/avatar", protect, uploadAvatarMiddleware, uploadProfileAvatar)

router.get("/:id", getUser)
router.patch("/:id", protect, updateUser)

export default router;