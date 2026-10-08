import { eventControllers } from "../controllers/event.controller.js";
import express from "express";
import {verifyToken} from "../middlewares/verifyToken.js"
const router = express.Router();
// router.post("/", verifyToken,eventControllers.createEvent);
router.get("/", eventControllers.getEvents);
router.get("/:id",verifyToken, eventControllers.getEventById);

export const eventRoutes = router;