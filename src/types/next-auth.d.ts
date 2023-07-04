import type {Session, User} from "next-auth"
import type {JWT} from "next-auth/jwt"

type UserId = string
type Username = string | null

declare module "next-auth/jwt" {
    interface JWT {
        id: UserId,
        username?: Username
    }
}
declare module "next-auth" {
    interface Session {
        user: User & {
            id: UserId,
            username?: Username
        }
    }
}