// Add username property to session
declare global {
    declare module "express-session" {
        export interface Session {
            username?: string
        }
    }
}