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
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusIcon } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { Task as TaskInterface } from "@/database/types"
import { addTask } from "@/database/query/translaction"

export function Create() {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div className="pb-3 flex flex-row justify-start text-sm items-center hover:underline cursor-pointer">
                        <PlusIcon className="h-3 w-3 me-1" />
                        Create
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Let's go</DialogTitle>
                        <DialogDescription>
                            Compile the form and press create.
                        </DialogDescription>
                    </DialogHeader>
                    <TaskForm setOpen={setOpen} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <div className="pb-3 flex flex-row justify-start text-sm items-center hover:underline cursor-pointer">
                    <PlusIcon className="h-3 w-3 me-1" />
                    Create
                </div>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Let's go</DrawerTitle>
                    <DrawerDescription>
                        Compile the form and press create.
                    </DrawerDescription>
                </DrawerHeader>
                <TaskForm className="px-4" setOpen={setOpen} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

interface TaskFormProps {
    className?: string;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>; // Type for setOpen
}

function TaskForm({ className, setOpen }: TaskFormProps) {
    const title = React.useRef<HTMLInputElement>(null);
    const description = React.useRef<HTMLTextAreaElement>(null);

    const saveTask = async () => {
        if (!title.current || !description.current) return;
        const task: TaskInterface = {
            title: title.current.value as string, // Get the value from the ref
            description: description.current.value as string, // Get the value from the ref
            date: new Date(),
            completed: false
        }

        const id = await addTask(task);
        if (id) {
            setOpen(false);
        } else {
            alert("Error occurred");
        }
    }

    return (
        <form className={cn("grid items-start gap-4", className)}>
            <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input type="text" id="title" placeholder="fix the bug" ref={title} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea placeholder="Oh, I did not logged it." rows={3} ref={description} />
            </div>
            <Button type="submit" onClick={() => saveTask()}>Save it</Button>
        </form>
    )
}
