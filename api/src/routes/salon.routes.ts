import express from "express";
const router = express.Router();

import { createSalon, joinSalon, sendMessage, leaveSalon, deleteSalon } from "@controllers/salon.controller";

import authMiddleware from "@middlewares/auth.middleware";

router.post("/create", authMiddleware, createSalon);
router.post("/join", authMiddleware, joinSalon);
router.post("/message", authMiddleware, sendMessage);
router.post("/leave", authMiddleware, leaveSalon);
router.delete("/delete", authMiddleware, deleteSalon);

export default router;
