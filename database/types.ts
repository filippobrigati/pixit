export interface Task {
    id?: number;
    title: string;
    description: string | null;
    date: Date;
    completed: boolean;
}

export interface Config {
    key: string;
    showConnectionBadge: boolean;
    showFilterButton: boolean;
    showDebugMessageInToast: boolean;
}