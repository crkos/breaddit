"use client"

import {FC, useRef, useState} from "react";
import UserAvatar from "@/components/UserAvatar";
import {CommentVote, Comment, User} from "@prisma/client";
import {formatTimeToNow} from "@/lib/utils";
import CommentVotes from "@/components/CommentVotes";
import {Button} from "@/components/ui/Button";
import {MessageSquare} from "lucide-react";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {Label} from "@/components/ui/Label";
import {Textarea} from "@/components/ui/TextArea";
import {useMutation} from "@tanstack/react-query";
import {CommentRequest} from "@/lib/validators/comment";
import axios from "axios";
import {toast} from "@/hooks/use-toast";

type ExtendedComment = Comment & {
    votes: CommentVote[],
    author: User
}

interface PostCommentProps {
    comment: ExtendedComment,
    votesAmt: number,
    currentVote: CommentVote | undefined,
    postId: string
}

const PostComment: FC<PostCommentProps> = ({comment, votesAmt, currentVote, postId}) => {

    const commentRef = useRef<HTMLDivElement>(null)
    const {data: session} = useSession()
    const router = useRouter()
    const [isReplying, setIsReplying] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')

    const {mutate: postComment, isLoading} = useMutation({
        mutationFn: async ({postId, text, replyToId} : CommentRequest) => {
            const payload : CommentRequest = {
                postId,
                text,
                replyToId
            }
            const { data } = await axios.patch(`/api/subreddit/posts/comment`, payload)
            return data
        },
        onError: () => {
            return toast({
                title: "Something went wrong",
                description: "Comment was posted successfully, please try again",
                variant: "destructive"
            })
        },
        onSuccess: () => {
            router.refresh()
            setIsReplying(false)
        }
    })

    return (
        <div className="flex flex-col " ref={commentRef}>
            <div className="flex items-center">
                <UserAvatar user={{
                    name: comment.author.name || null,
                    image: comment.author.image || null,
                }} className="h-6 w-6"
                />
                <div className="ml-2 flex items-nceter gap-x-2">
                    <p className="text-sm font-medium text-gray-900">
                        u/{comment.author.username}
                    </p>
                    <p className="max-h-40 truncate text-xs text-zinc-500">
                        {formatTimeToNow(new Date(comment.createdAt))}

                    </p>
                </div>
            </div>

            <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>

            <div className="flex flex-wrap gap-2 items-center">
                <CommentVotes commentId={comment.id} initialVotesAmt={votesAmt} initialVote={currentVote}/>
                <Button onClick={() => {
                    if(!session) return router.push('/sign-in')
                    setIsReplying(prev => !prev)
                }} variant="ghost" size="xs">
                    <MessageSquare className="h-4 w-4 mr-1.5"/>
                    Reply
                </Button>
                {isReplying ? (
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="comment">Your comment</Label>
                        <div className="mt-2">
                            <Textarea id='comment' value={input} onChange={(e) => setInput(e.target.value)} rows={1} placeholder="What are your thoughts?"/>

                            <div className="mt-2 flex justify-end gap-2">
                                <Button tabIndex={-1} variant='subtle' onClick={() => setIsReplying(false)}>Cancel</Button>
                                <Button isLoading={isLoading} disabled={input.length === 0}  onClick={() => {
                                    if(!input) return
                                    postComment({
                                        postId,
                                        text: input,
                                        replyToId: comment.replyToId ?? comment.id
                                    })
                                }} >Post</Button>
                            </div>
                        </div>
                    </div>
                ): null}
            </div>
        </div>
    );
};

export default PostComment;