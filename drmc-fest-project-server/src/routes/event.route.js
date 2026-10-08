import { eventControllers } from "../controllers/event.controller.js";
import express from "express";

const router = express.Router();
// router.post("/", verifyToken,eventControllers.createEvent);
router.get("/", eventControllers.getEvents);
router.get("/:id", eventControllers.getEventById);

export const eventRoutes = router;