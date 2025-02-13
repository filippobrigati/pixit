"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { FilterIcon } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function Filter({
    priorityf,
    datef,
    currentPriority,
    currentDate,
}: {
    priorityf: (priority: "LOW" | "MEDIUM" | "URGENT" | null) => void;
    datef: (date: Date | null) => void;
    currentPriority: "LOW" | "MEDIUM" | "URGENT" | null;
    currentDate: Date | null;
}) {
    // Handle changes in priority
    const handlePriorityChange = (value: string) => {
        let newPriority: "LOW" | "MEDIUM" | "URGENT" | null = null;
        if (value === "NULL") {
            priorityf(null); // Update parent component
        } else {
            newPriority = value.toUpperCase() as "LOW" | "MEDIUM" | "URGENT";
            priorityf(newPriority);
        }
    };

    // Handle date selection
    const handleDateChange = (selectedDate: Date | undefined) => {
        datef(selectedDate || null); // Update parent component
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="pb-3 flex flex-row justify-start text-sm items-center hover:underline cursor-pointer">
                    <FilterIcon className="h-3 w-3 me-1" />
                    Filter
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Filter</h4>
                        <p className="text-sm text-muted-foreground">
                            I want to see only tasks with
                        </p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="w-full items-center gap-4">
                            <Label htmlFor="width">priority</Label>
                            <Select onValueChange={handlePriorityChange} value={currentPriority ? currentPriority?.toUpperCase().toString() : "NULL"}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="NULL" defaultChecked >Select filter</SelectItem>
                                        <SelectItem value="LOW">Low</SelectItem>
                                        <SelectItem value="MEDIUM">Medium</SelectItem>
                                        <SelectItem value="URGENT">Urgent</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full items-center gap-4">
                            <Label htmlFor="maxWidth">a due dates by</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !currentDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {currentDate ? format(currentDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={currentDate as Date}
                                        onSelect={handleDateChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <Button variant={'outline'} onClick={() => {
                        priorityf(null);
                        datef(null);
                    }}>Reset</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}