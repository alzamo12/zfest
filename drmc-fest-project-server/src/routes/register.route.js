import { festControllers } from "../controllers/fest.controller.js";
import express from "express";
import {verifyToken} from "../middlewares/verifyToken.js";
import { registrationController } from "../controllers/register.controller.js";

const router = express.Router();
router.post("/", verifyToken,registrationController.createRegistration);

export const registrationRoutes = router;