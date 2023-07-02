import {Comment, Post, Subreddit, Vote, User} from "@prisma/client";

export type ExtendedPost = Post & {
    subreddit: Subreddit,
    votes: Vote[],
    author: User,
    comments: Comment[]
}