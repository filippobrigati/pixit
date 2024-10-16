import { openDB, DBSchema } from 'idb';
import { Task as TaskInterface } from '../types';
import { MyDBV1 } from '../structure/db';

async function openDatabase() {
    const db = await openDB<MyDBV1>(process.env.NEXT_PUBLIC_DB_NAME!, parseInt(process.env.NEXT_PUBLIC_DB_VERSION!));
    return db;
}

// Function to get all tasks
export async function getAllTasks(): Promise<TaskInterface[]> {
    const db = await openDatabase(); // Properly await the database connection
    const tx = db.transaction('task', 'readonly'); // Initiate transaction
    const store = tx.objectStore('task');
    const tasks = await store.getAll(); // Get all tasks from the store
    await tx.done; // Wait for the transaction to complete
    return tasks;
}

export async function addTask(task: TaskInterface): Promise<string> {
    const db = await openDatabase();
    const tx = db.transaction('task', 'readwrite');
    const store = tx.objectStore('task');

    const inseredId = await store.add(task);
    console.log(inseredId);

    return inseredId;
}