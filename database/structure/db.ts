import { openDB, DBSchema } from 'idb';
import { Config, Task as TaskInterface } from '../types';
import { useConfigStore, useTaskStore } from '@/database/structure/zu';

export interface MyDBV1 extends DBSchema {
    task: {
        key: string;
        value: TaskInterface;
        indexes: { 'by-id': number };
    };
    config: {
        key: string;
        value: Config;
    }
}

export async function initDB() {
    const db = await openDB<MyDBV1>(process.env.NEXT_PUBLIC_DB_NAME!, parseInt(process.env.NEXT_PUBLIC_DB_VERSION!), {
        upgrade(db, oldVersion) {
            // Create object store only if it doesn't exist
            if (!db.objectStoreNames.contains('task')) {
                const taskStore = db.createObjectStore('task', { keyPath: 'id', autoIncrement: true });
                taskStore.createIndex('by-id', 'id');
                // Add the initial task only if the database was just created (oldVersion is 0)
                if (oldVersion === 0) {
                    const initialTask: TaskInterface = {
                        id: "1",
                        title: "First try",
                        description: "I'm a description",
                        date: new Date(),
                        priority: "URGENT",
                        completed: false
                    };

                    // Add the task and await the generated key
                    taskStore.transaction.oncomplete = async () => {
                        const tx = db.transaction('task', 'readwrite');
                        const store = tx.objectStore('task');
                        const id = await store.add({...initialTask}); // Await the result, which will be the auto-generated id
                    };
                }
            }

            if (!db.objectStoreNames.contains('config')) {
                const configStore = db.createObjectStore('config', { keyPath: 'key' });

                // Add initial config only if the database was just created (oldVersion is 0)
                if (oldVersion === 0) {
                    const initialConfig: Config = {
                        key: 'default',
                        username: "",
                        showConnectionBadge: true,
                        showFilterButton: true,
                        showDebugMessageInToast: true,
                    };
                    // Add the config
                    configStore.transaction.oncomplete = async () => {
                        const tx = db.transaction('config', 'readwrite');
                        const store = tx.objectStore('config');
                        await store.add({ ...initialConfig });
                    };
                }
            }
        }
    });

    // Load existing config into state
    const configValue = await db.get('config', 'default');
    if (configValue) {
        useConfigStore.getState().updateShowConnectionBadge(configValue.showConnectionBadge);
        useConfigStore.getState().updateShowFilterButton(configValue.showFilterButton);
        useConfigStore.getState().updateShowDebugMessageInToast(configValue.showDebugMessageInToast);
        useConfigStore.getState().updateUserName(configValue.username);
    }

    // Load existing tasks
    const tasksValue = await db.getAll('task');
    if (tasksValue) {
        useTaskStore.getState().setTasks(tasksValue);
        //useTaskStore.getState().setFilteredTask(tasksValue);
    }

    return db;
}