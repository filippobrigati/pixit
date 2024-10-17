export interface Task {
    id: string;
    title: string;
    description: string | null;
    date: Date;
    completed: boolean;
    priority: "LOW" | "MEDIUM" | "URGENT"
}

export interface Config {
    key: string;
    username: string;
    showConnectionBadge: boolean;
    showFilterButton: boolean;
    showDebugMessageInToast: boolean;
}