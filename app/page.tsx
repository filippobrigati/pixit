"use client";

import { Create } from "@/components/create";
import { Filter } from "@/components/filter";
import NetworkBadge from "@/components/network-badge";
import { Settings } from "@/components/settings";
import { ThemeBadge } from "@/components/theme-badge";
import { Task as TaskInterface } from "@/database/types";
import Task from "@/components/task";
import React from "react";
import { initDB } from "@/database/structure/db";
import { getAllTasks } from "@/database/query/translaction";
import { useConfigStore } from '@/database/structure/zu';

export default function Home() {
  const [data, setData] = React.useState<TaskInterface[]>([]);
  const [uncompletedCount, setUncompletedCount] = React.useState(0);

  const showConnectionBadge = useConfigStore((state) => state.showConnectionBadge);

  React.useEffect(() => {
    // Initialize the database and fetch tasks asynchronously
    const fetchTasks = async () => {
      await initDB(); // Ensure DB is initialized
      const tasks = await getAllTasks(); // Fetch all tasks
      setData(tasks); // Set the fetched tasks

      // Calculate the count of uncompleted tasks
      const uncompleted = tasks.filter(task => !task.completed).length;
      setUncompletedCount(uncompleted);
    };

    fetchTasks();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">Hi, Filippo Brigati</p>
          <p className="text-sm text-muted-foreground">You have <b>{uncompletedCount}</b> uncompleted tasks.</p>
          {
            showConnectionBadge ? <NetworkBadge /> : <></>
          }
        </div>
        <div className="flex flex-row justify-start items-start mt-3 sm:mt-0 gap-x-4">
          <ThemeBadge />
          <Settings />
        </div>
      </div>
      <div className="mt-10 md:mt-24 mb-3 w-full flex flex-row justify-between items-center">
        <Create />
        <Filter />
      </div>
      <div className="space-y-8 h-[calc(100%-16rem)] overflow-y-auto">
        {data.map((d: TaskInterface, index: number) => <Task key={index} data={d} index={index} />)}
      </div>
    </div>
  );
}