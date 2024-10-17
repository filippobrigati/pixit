import { openDB } from 'idb';
import { Config, Task, Task as TaskInterface } from '../types';
import { MyDBV1 } from '../structure/db';

async function openDatabase() {
    const db = await openDB<MyDBV1>(process.env.NEXT_PUBLIC_DB_NAME!, parseInt(process.env.NEXT_PUBLIC_DB_VERSION!));
    return db;
}

export async function addTask(task: TaskInterface): Promise<{ data: Task | null, error: string | null }> {
    try {
        const db = await openDatabase();
        const tx = db.transaction('task', 'readwrite');
        const store = tx.objectStore('task');

        const id = await store.add(task);

        return { data: { ...task, id: id.toString() }, error: null };
    } catch (error: any) {
        console.log(error);
        return { data: null, error: error.message };
    }
}

export async function completeTask(id: string): Promise<boolean> {
    try {
        const db = await openDatabase();

        const res = await db.getFromIndex("task", "by-id", parseInt(id));
        if (res) {
            const transaction = db.transaction(["task"], "readwrite");
            transaction.objectStore("task").delete(res.id);
        } else {
            throw new Error("Task with ID not found");
        }

        return true;
    } catch (e) {
        console.error('Error updating task:', e);
        return false;
    }
}

export async function getAllTasks(): Promise<Task[] | undefined> {
    try {
        const db = await openDatabase();
        const tx = db.transaction("task", "readonly");

        return await tx.store.getAll();
    } catch (error) {
        console.log(error);
        return undefined;
    }
}

export async function updateUsername(username: string): Promise<boolean> {
    try {
        const db = await openDatabase();
        const tx = db.transaction("config", "readwrite");

        const store = tx.objectStore("config");

        // Fetch the current config
        const currentConf: Config | undefined = await store.get("default");

        // If no config exists, you might want to handle this case
        if (!currentConf) {
            throw new Error("Configuration not found");
        }

        const updatedConf: Config = {
            ...currentConf,  // Spread existing properties
            username: username // Update username
        };

        await store.put(updatedConf);
        await tx.done;

        return true;
    } catch (e) {
        alert(e);
        return false;
    }
}