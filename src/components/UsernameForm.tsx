"use client"

import {useForm} from "react-hook-form";
import {UsernameRequest, UsernameValidator} from "@/lib/validators/username";
import {zodResolver} from "@hookform/resolvers/zod";
import {User} from "@prisma/client";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/Card";
import {Label} from "@/components/ui/Label";
import {Input} from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";
import {useMutation} from "@tanstack/react-query";
import axios, {AxiosError} from "axios";
import {toast} from "@/hooks/use-toast";
import {router} from "next/client";
import {useRouter} from "next/navigation";

interface UsernameFormProps {
    user: Pick<User, 'id' | 'username'>
}

const UsernameForm = ({user}: UsernameFormProps) => {
    const { handleSubmit, register, formState: {errors} } = useForm<UsernameRequest>({
        resolver: zodResolver(UsernameValidator),
        defaultValues: {
            name: user.username || ''
        }
    })
    const router = useRouter()

    const {mutate: updateUser, isLoading} = useMutation({
        mutationFn: async ({name}: UsernameRequest) => {
            const payload: UsernameRequest = {name}
            const {data} = await axios.patch('/api/username', payload)
            return data
        },
        onError: (error) => {
            if(error instanceof AxiosError){
                if (error.response?.status === 409) {
                    return toast({
                        title: "Username already taken.",
                        description: "Please choose a different  username",
                        variant: "destructive"
                    })
                }
            }
            toast({
                title: "There was an error.",
                description: "Could not change name.",
                variant: "destructive"
            })
        },
        onSuccess: () => {
            toast({
                description: "Your name has been updated"
            })
            router.refresh()
        }
    })


    return (
        <form onSubmit={handleSubmit((e) => updateUser(e))}>
            <Card>
                <CardHeader>
                    <CardTitle>Your username</CardTitle>
                    <CardDescription>Please enter a display name you are comfortable with</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative grid gap-1">
                        <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
                            <span className="text-sm text-zinc-400">u/</span>
                        </div>
                        <Label className="sr-only">Name</Label>
                        <Input id="name" className="w-[400px] pl-6" size={32} {...register('name')} />
                        {errors?.name && (
                            <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button isLoading={isLoading}>Change name</Button>
                </CardFooter>
            </Card>
        </form>
    );
};

export default UsernameForm;