import express from "express";
import cors from "cors";
import { festRoutes } from "./routes/fest.route.js";
import { eventRoutes } from "./routes/event.route.js";
import { registrationRoutes } from "./routes/register.route.js";

export const app = express();

app.use(express.json());

app.use(cors({
    origin: [
        'http://localhost:5173',
    ],
    credentials: true,
}));


app.get("/", (req, res) => {
    res.send("Focus Hub API is running");
});

app.use("/api/fests", festRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/register", registrationRoutes);
