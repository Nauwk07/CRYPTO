import express from "express";
const router = express.Router();

import {
  getSalon,
  createSalon,
  joinSalon,
  leaveSalon,
} from "@controllers/salon.controller";

import authMiddleware from "@middlewares/auth.middleware";

router.get("/:id", authMiddleware, getSalon);
router.post("/create", authMiddleware, createSalon);
router.post("/join", authMiddleware, joinSalon);
router.post("/leave", authMiddleware, leaveSalon);

export default router;
