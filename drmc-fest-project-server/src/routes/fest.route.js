import { festControllers } from "../controllers/fest.controller.js";
import express from "express";
import {verifyToken} from "../middlewares/verifyToken.js";

const router = express.Router();
router.post("/", verifyToken,festControllers.createFest);
router.get("/", festControllers.getFests);
router.get("/:id", festControllers.getFestById);

export const festRoutes = router;