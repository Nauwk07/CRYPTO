import express from "express";
const router = express.Router();

import { getAllUsers } from "@controllers/user.controller";

import authMiddleware from "@middlewares/auth.middleware";

router.get("/", authMiddleware, getAllUsers);

export default router;
