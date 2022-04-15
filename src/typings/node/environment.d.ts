declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string;
            MONGODB_URI: string;
            SPOTIFYCLIENTID: string;
            SPOTIFYCLIENTSECRET: string;
            CLIENT_ID: string;
        }
    }
}

export { }