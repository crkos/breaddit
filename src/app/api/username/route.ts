import {getAuthSession} from "@/lib/auth";
import {UsernameValidator} from "@/lib/validators/username";
import {db} from "@/lib/db";
import {z} from "zod";

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', {status: 401})
        }
        const body = await req.json()

        const {name} = UsernameValidator.parse(body)

        const username = await db.user.findFirst({
            where: {
                username: name
            }
        })

        if (username) {
            return new Response('Username is taken', {status: 409})
        }

        // update username in db

        await db.user.update({
            where: {
                id: session.user.id
            },
            data: {
                username: name
            }
        })
        return new Response('OK')

    } catch (err) {
        if (err instanceof z.ZodError) {
            return new Response('Invalid request data passed', {status: 422})
        }
        return new Response('Could not change username, please try again later', {status: 500})
    }
}