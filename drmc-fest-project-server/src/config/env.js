import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 5000,
    db_user: process.env.DB_USER,
    db_pass: process.env.DB_PASS,
    gemini_api_key: process.env.GEMINI_API_KEY,
};

export default config;