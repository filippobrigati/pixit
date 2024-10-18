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
import { Label } from "@/components/ui/label"
import { SettingsIcon } from "lucide-react"
import { Switch } from "./ui/switch"
import { useConfigStore } from "@/database/structure/zu"
import { updateConfig } from "@/database/query/translaction"
import { useToast } from "@/hooks/use-toast"

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
    const { toast } = useToast();

    const updateShowConnectionBadge = useConfigStore((state) => state.updateShowConnectionBadge);
    const updateShowFilterButton = useConfigStore((state) => state.updateShowFilterButton);
    const updateShowDebugMessageInToast = useConfigStore((state) => state.updateShowDebugMessageInToast);

    const showConnectionBadge = useConfigStore((state) => state.showConnectionBadge);
    const showDebugMessageInToast = useConfigStore((state) => state.showDebugMessageInToast);
    const showFilterButton = useConfigStore((state) => state.showFilterButton);

    const updateSettings = async (item: "conn" | "filter" | "debug", value: boolean) => {
        try {
            switch (item) {
                case "conn":
                    const { error: eConn } = await updateConfig(value, showFilterButton, showDebugMessageInToast);
                    if (eConn) throw new Error(eConn);
                    updateShowConnectionBadge(value);
                    break;
                case "filter":
                    const { error: eFilt } = await updateConfig(value, showFilterButton, showDebugMessageInToast);
                    if (eFilt) throw new Error(eFilt);
                    updateShowFilterButton(value);
                    break;
                case "debug":
                    const { error: eDeb } = await updateConfig(value, showFilterButton, showDebugMessageInToast);
                    if (eDeb) throw new Error(eDeb);
                    updateShowDebugMessageInToast(value);
                    break;
            }

            toast({
                title: "Settings updated correcty",
            });
        } catch (e: any) {
            toast({
                title: "Error",
                description: "Something went wrong!"
            });
        }
    }

    return (
        <div className={cn("flex flex-col items-start gap-4", className)}>
            <div className="w-full flex flex-row justify-between items-center">
                <Label htmlFor="connection-badge">Show connection state badge</Label>
                <Switch id="connection-badge" checked={showConnectionBadge}
                    onCheckedChange={(v) => updateSettings("conn", v)} />
            </div>
            <div className="w-full flex flex-row justify-between items-center">
                <Label htmlFor="filter-button">Show filter button</Label>
                <Switch id="filter-button" checked={showFilterButton}
                    onCheckedChange={(v) => updateSettings("filter", v)} />
            </div>
            <span className="text-sm text-muted-foreground">Developer options</span>
            <div className="w-full flex flex-row justify-between items-center">
                <Label htmlFor="error-toast">Show debug message in error toast</Label>
                <Switch id="error-toast" checked={showDebugMessageInToast}
                    onCheckedChange={(v) => updateSettings("debug", v)} />
            </div>
            <span className="text-sm text-muted-foreground">Integrations</span>
            <div className="w-full flex flex-row justify-between items-center">
                <Label htmlFor="error-toast">Connect with google calendar</Label>
            </div>
            <div className="w-full flex flex-row justify-between items-center">
                <Label htmlFor="error-toast">Connect with supabase</Label>
            </div>
            <span className="text-sm text-muted-foreground">Account settings</span>
            <div className="w-full grid grid-cols-12 gap-4">
                <Button variant={'outline'} className="col-span-12 border-red-500 hover:border-red-700 hover:bg-red-700 hover:text-white">
                    Delete data
                </Button>
            </div>
        </div>
    )
}