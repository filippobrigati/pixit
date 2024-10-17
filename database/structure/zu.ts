import { create } from 'zustand';
import { Config, Task } from '../types';

export type ConfigState = Config;

type Action = {
    updateShowConnectionBadge: (item: ConfigState['showConnectionBadge']) => void
    updateShowFilterButton: (item: ConfigState['showFilterButton']) => void
    updateShowDebugMessageInToast: (item: ConfigState['showDebugMessageInToast']) => void
    updateUserName: (username: ConfigState['username']) => void
}

// Create your store, which includes both state and (optionally) actions
export const useConfigStore = create<ConfigState & Action>((set) => ({
    username: '',
    showConnectionBadge: true,
    showDebugMessageInToast: false,
    showFilterButton: true,
    key: '',
    updateShowConnectionBadge: (item: boolean) => set(() => ({ showConnectionBadge: item })),
    updateShowFilterButton: (item: boolean) => set(() => ({ showFilterButton: item })),
    updateShowDebugMessageInToast: (item: boolean) => set(() => ({ showDebugMessageInToast: item })),
    updateUserName: (item: string) => set(() => ({ username: item }))
}));

type TaskState = {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
    addTask: (task: Task) => void;
    removeTask: (id: string) => void;
    updateTask: (task: Task) => void;
};

const initialState: TaskState = {
    tasks: [],
    addTask: () => { },
    removeTask: () => { },
    updateTask: () => { },
    setTasks: () => { }
};

export const useTaskStore = create<TaskState>((set) => ({
    tasks: [],
    setTasks: (tasks: Task[]) => set(() => ({
        tasks: tasks,
    })),
    addTask: (newTask: Task) => set((state) => ({
        tasks: [...state.tasks, newTask],
    })),
    removeTask: (id: string) => set((state) => ({
        tasks: state.tasks.filter((task) => parseInt(task.id) !== parseInt(id)),
    })),
    updateTask: (updatedTask: Task) => set((state) => ({
        tasks: state.tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
        ),
    })),
    reset: () => {
        set(initialState)
    },
}));