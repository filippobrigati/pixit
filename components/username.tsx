"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { updateUsername } from "@/database/query/translaction"
import { useConfigStore } from "@/database/structure/zu"
import { useToast } from "@/hooks/use-toast"

export default function Username({ children, isDefaultOpen }: { children: React.ReactNode, isDefaultOpen: boolean }) {
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const [isOpen, setIsOpen] = React.useState(isDefaultOpen);

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Welcome in Pixit!</DialogTitle>
                        <DialogDescription>
                            It's time not to forget things, what's your name?
                        </DialogDescription>
                    </DialogHeader>
                    <ProfileForm setIsOpen={setIsOpen} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer defaultOpen={isDefaultOpen}>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Welcome in Pixit!</DrawerTitle>
                    <DrawerDescription>
                        It's time not to forget things, what's your name?
                    </DrawerDescription>
                </DrawerHeader>
                <ProfileForm className="px-4" setIsOpen={setIsOpen} />
            </DrawerContent>
        </Drawer>
    )
}

interface TaskFormProps {
    className?: string;
    setIsOpen: (isOpen: boolean) => void;
}

function ProfileForm({ className, setIsOpen }: TaskFormProps) {
    const { toast } = useToast();

    const updateUsernameInStore = useConfigStore((state) => state.updateUserName);

    const username = React.useRef<HTMLInputElement>(null);


    const saveUsername = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!username.current?.value) return;
        const response = await updateUsername(username.current.value);
        if (response) {
            updateUsernameInStore(username.current.value);
            toast({
                title: `Hi, ${username.current.value}`,
                description: "Username saved successfully"
            });
            setIsOpen(false);
        } else {
            toast({
                title: `Error`,
                description: "Something went wrong"
            });
        }
    }

    return (
        <form className={cn("flex flex-col gap-4 pb-6 sm:pb-0", className)}>
            <div className="grid gap-2">
                <Input type="text" id="name" ref={username} />
            </div>
            <div className="w-full flex sm:justify-end">
                <Button type="submit" className="w-full sm:w-[100px]" onClick={(e) => saveUsername(e)}>Okey</Button>
            </div>
        </form>
    )
}