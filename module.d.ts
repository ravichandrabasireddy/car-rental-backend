declare namespace NodeJS {
    interface ProcessEnv {
        DATABASE_URL: string;
        JWT_SECRET_KEY: string;
        JWT_REFRESH_TOKEN_KEY: string;
        SERVICE_ACCOUNT_KEY_PATH: string;
        STORAGE_BUCKET_NAME: string;
        PUBLIC_IMAGE_URL: string;
        REDIS_HOST: string;
        REDIS_PORT: string;
    }
}