import admin from "firebase-admin";
import config from "./env.js";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: config.firebase_project_id,
            clientEmail: config.firebase_client_email,
            privateKey: config.firebase_private_key.replace(/\\n/g, "\n"),
        }),
    });
}

export default admin;