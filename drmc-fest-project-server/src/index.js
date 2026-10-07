
import {app} from "./app.js";
import { dbConnect } from "./config/db.js";
import config from "./config/env.js";

const PORT = config.port || 5000;

const startServer = async () => {
    try {
        // connect mongodb first
        await dbConnect();

        // then start express

        if (!process.env.VERCEL) {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }

    } catch (err) {
        console.error("Server startup failed", err);
    }
};

startServer();
