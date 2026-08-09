import { exampleGetController } from '#app/controllers/exampleController.js';
import { Router } from 'express'

const router = Router();
router.get("/", exampleGetController)

export default router;