import express from "express";
import cors from "cors";

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

app.use("/api/fest",)
