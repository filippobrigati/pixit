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
import { CalendarIcon, PlusIcon } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { Task as TaskInterface } from "@/database/types"
import { addTask } from "@/database/query/translaction"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { format } from "date-fns"
import { Calendar } from "./ui/calendar"
import { useTaskStore } from "@/database/structure/zu"

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
    
    const [priority, setPriority] = React.useState<"LOW" | "MEDIUM" | "URGENT">("LOW");
    const [date, setDate] = React.useState<Date>();

    const addTaskStore = useTaskStore((state) => state.addTask);

    const saveTask = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!title.current || !description.current) return;
        const task: TaskInterface = {
            title: title.current.value as string, // Get the value from the ref
            description: description.current.value as string, // Get the value from the ref
            date: date as Date,
            priority: priority,
            completed: false
        } as TaskInterface; // Avoid typescript error on missing field ID
        // Save data in indexedDB
        const { data, error } = await addTask(task);
        if (error) {
            alert(error);
        } else {
            addTaskStore(data as TaskInterface);
        }
        setOpen(false);
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
            <div className="grid gap-2">
                <Label htmlFor="width">Priority</Label>
                <Select required onValueChange={(val) => setPriority(val as  "LOW" | "MEDIUM" | "URGENT")}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="URGENT">Urgent</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="maxWidth">Expiring date</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <Button type="submit" onClick={(e) => saveTask(e)}>Save it</Button>
        </form>
    )
}
