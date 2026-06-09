import fa from "./fa";

export type MessagesType = typeof fa;

declare module 'next-intl' {
    interface AppConfig {
        Messages: MessagesType;
    }
}