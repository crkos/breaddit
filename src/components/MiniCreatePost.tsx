"use client"
import {usePathname, useRouter} from "next/navigation";
import {FC} from "react";
import {Session} from "next-auth";
import UserAvatar from "@/components/UserAvatar";
import {Input} from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";
import {ImageIcon, Link2} from "lucide-react";

interface MiniCreatPostProps {
    session: Session | null
}

const MiniCreatePost: FC<MiniCreatPostProps> = ({session}) => {
    const router = useRouter()
    const pathName = usePathname()
    return (
        <li className="overflow-hidden rounded-md bg-white shadow list-none">
            <div className="h-full px-6 py-4 flex justify-between gap-6">
                <div className="relative">
                    <UserAvatar user={{
                        name: session?.user.name || null,
                        image: session?.user.image || null
                    }} />
                    <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white"/>
                </div>
                <Input readOnly onClick={() => router.push(pathName + '/submit')} placeholder="Create post"/>
                <Button variant="ghost" onClick={() => router.push(pathName + '/submit')}>
                    <ImageIcon className="text-zinc-600"/>
                </Button>
                <Button variant="ghost" onClick={() => router.push(pathName + '/submit')}>
                    <Link2 className="text-zinc-600"/>
                </Button>
            </div>
        </li>
    );
};

export default MiniCreatePost;