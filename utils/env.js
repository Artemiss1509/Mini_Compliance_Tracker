import { config } from "dotenv";

config({path: `.env.${process.env.NODE_ENV || 'dev'}.local`});

export const {
    JWT_SECRET,
    JWT_EXPIRY,
    DATABASE_URL,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_SSL,
} = process.env;
