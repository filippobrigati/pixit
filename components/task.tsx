import { Checkbox } from "@/components/ui/checkbox";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Task as TaskInterface } from "@/database/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { PencilIcon, PrinterIcon, TrashIcon } from "lucide-react";

export default function Task({ data, complete }: { data: TaskInterface, complete: (id: string) => Promise<void> }) {
    return (
        <div>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div className="items-top flex space-x-2">
                        <Checkbox id={data.id.toString()} onCheckedChange={() => complete(data.id!.toString())} />
                        <div className="grid gap-1 leading-none">
                            <label
                                htmlFor={data.id.toString()}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-row justify-start items-center"
                            >
                                {data.title}
                                <span
                                    className={cn(
                                        "flex h-2 w-2 rounded-full mx-2",
                                        data.priority === "LOW" ? 'bg-sky-500' :
                                            data.priority === "MEDIUM" ? 'bg-yellow-500' : 'bg-red-500'
                                    )}
                                />
                            </label>
                            <label htmlFor={data.id.toString()} className="text-sm text-muted-foreground">
                                {data.description}
                            </label>
                            {data.date ? 
                            <span className={cn("text-sm text-muted-foreground italic", data.date < new Date() ? 'text-red-400' : '')}>
                                {format(data.date, "PP")}
                            </span> : ''}
                        </div>
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem asChild className="text-blue-500 hover:text-blue-600 focus:text-blue-600">
                        <span className="flex flex-row justify-start items-center">
                            <PrinterIcon className="h-3 w-3 me-2" />
                            Print
                        </span>
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem asChild className="text-yellow-500 hover:text-yellow-600 focus:text-yellow-600">
                        <span className="flex flex-row justify-start items-center">
                            <PencilIcon className="h-3 w-3 me-2" />
                            Edit
                        </span>
                    </ContextMenuItem>
                    <ContextMenuItem asChild className="text-red-500 hover:text-red-600 focus:text-red-600">
                        <span className="flex flex-row justify-start items-center">
                            <TrashIcon className="h-3 w-3 me-2" />
                            Delete
                        </span>
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </div>
    )
}