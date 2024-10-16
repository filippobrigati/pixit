"use client";

import { Badge } from "@/components/ui/badge"
import useNetworkStatus from "@/hooks/network-status";

export default function NetworkBadge() {
    const { isOnline } = useNetworkStatus();

    if (isOnline) {
        return (
            <Badge variant="outline" className="mt-3">
                <span className="flex h-2 w-2 rounded-full bg-green-500 mx-2" />
                Online
            </Badge>
        );
    }

    return (
        <Badge variant="outline" className="mt-3">
            <span className="flex h-2 w-2 rounded-full bg-red-500 mx-2" />
            Offline
        </Badge>
    )
}
