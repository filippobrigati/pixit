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
import { PlusIcon, SettingsIcon } from "lucide-react"
import { Textarea } from "./ui/textarea"
import { Switch } from "./ui/switch"
import { useConfigStore } from "@/database/structure/zu"

export function Settings() {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <SettingsIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                        <DialogDescription>
                            Personalize and set up Pixit
                        </DialogDescription>
                    </DialogHeader>
                    <SettingsContent />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" size="icon">
                    <SettingsIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Settings</DrawerTitle>
                    <DrawerDescription>
                        Personalize and set up Pixit
                    </DrawerDescription>
                </DrawerHeader>
                <SettingsContent className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function SettingsContent({ className }: React.ComponentProps<"form">) {
    const updateShowConnectionBadge = useConfigStore((state) => state.updateShowConnectionBadge);
    const updateShowFilterButton = useConfigStore((state) => state.updateShowFilterButton);
    const updateShowDebugMessageInToast = useConfigStore((state) => state.updateShowDebugMessageInToast);

    const showConnectionBadge = useConfigStore((state) => state.showConnectionBadge);
    const showDebugMessageInToast = useConfigStore((state) => state.showDebugMessageInToast);
    const showFilterButton = useConfigStore((state) => state.showFilterButton);

    return (
        <div className={cn("flex flex-col items-start gap-4", className)}>
            <div className="w-full flex flex-row justify-between items-center">
                <Label htmlFor="connection-badge">Show connection state badge</Label>
                <Switch id="connection-badge" checked={showConnectionBadge}
                    onCheckedChange={updateShowConnectionBadge} />
            </div>
            <div className="w-full flex flex-row justify-between items-center">
                <Label htmlFor="filter-button">Show filter button</Label>
                <Switch id="filter-button" checked={showFilterButton}
                    onCheckedChange={updateShowFilterButton} />
            </div>
            <span className="text-sm text-muted-foreground">Developer options</span>
            <div className="w-full flex flex-row justify-between items-center">
                <Label htmlFor="indexed-db">Save data locally to save loading time</Label>
                <Switch id="indexed-db" />
            </div>
            <div className="w-full flex flex-row justify-between items-center">
                <Label htmlFor="error-toast">Show debug message in error toast</Label>
                <Switch id="error-toast" checked={showDebugMessageInToast}
                    onCheckedChange={updateShowDebugMessageInToast} />
            </div>
            <span className="text-sm text-muted-foreground">Account settings</span>
            <div className="w-full grid grid-cols-12 gap-4">
                <Button variant={'outline'} className="col-span-6 border-red-500 hover:border-red-700 hover:bg-red-700 hover:text-white">
                    Delete local data
                </Button>
                <Button variant={'outline'} className="col-span-6 bg-red-500 border-red-500 hover:border-red-700 hover:bg-red-700 hover:text-white">
                    Delete account
                </Button>
            </div>
        </div>
    )
}