import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 5000,
    db_user: process.env.DB_USER,
    db_pass: process.env.DB_PASS,
    gemini_api_key: process.env.GEMINI_API_KEY,
    firebase_private_key: process.env.FIREBASE_PRIVATE_KEY,
    firebase_project_id: process.env.FIREBASE_PROJECT_ID,
    firebase_client_email: process.env.FIREBASE_CLIENT_EMAIL
};

export default config;