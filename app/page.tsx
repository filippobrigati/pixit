"use client";

import { Create } from "@/components/create";
import { Filter } from "@/components/filter";
import NetworkBadge from "@/components/network-badge";
import { Settings } from "@/components/settings";
import { ThemeBadge } from "@/components/theme-badge";
import { Task as TaskInterface } from "@/database/types";
import Task from "@/components/task";
import React from "react";
import { useConfigStore, useTaskStore } from '@/database/structure/zu';
import { completeTask } from "@/database/query/translaction";
import Username from "@/components/username";
import { initDB } from "@/database/structure/db";

export default function Home() {
  const username = useConfigStore((state) => state.username);

  const showConnectionBadge = useConfigStore((state) => state.showConnectionBadge);
  const showFilterButton = useConfigStore((state) => state.showFilterButton);

  const tasks = useTaskStore((state) => state.tasks);
  const removeTask = useTaskStore((state) => state.removeTask);

  const [priorityFilter, setPriorityFilter] = React.useState<"LOW" | "MEDIUM" | "URGENT" | null>(null);
  const [dateFilter, setDateFilter] = React.useState<Date | null>(null);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const loadData = async () => {
      await initDB();
      setIsLoading(false);
    }

    loadData();
  }, []);

  // Memoize filtered tasks to avoid recalculating on every render unless dependencies change
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      if (priorityFilter && task.priority !== priorityFilter) return false;
      if (dateFilter && new Date(task.date).toDateString() !== dateFilter.toDateString()) return false;
      return true;
    });
  }, [tasks, priorityFilter, dateFilter]);

  const handleCompleteTask = async (id: string) => {
    const response = await completeTask(id);
    if (response) {
      removeTask(id);
      // Show success toast
    } else {
      // Show error toast
    }
  }

  return (
    <div className="w-full h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">Hi,{" "}
            {
              isLoading ? null :
                <Username isDefaultOpen={username === "default" ? true : false}>
                  <span className="hover:underline hover:cursor-pointer">{username}</span>
                </Username>
            }
          </p>
          <p className="text-sm text-muted-foreground">You have <b>{tasks.length}</b> uncompleted tasks.</p>
          {showConnectionBadge ? <NetworkBadge /> : null}
        </div>
        <div className="flex flex-row justify-start items-start mt-3 sm:mt-0 gap-x-4">
          <ThemeBadge />
          <Settings />
        </div>
      </div>
      <div className="mt-10 md:mt-24 mb-3 w-full flex flex-row justify-between items-center">
        <Create />
        {showFilterButton ?
          <Filter currentPriority={priorityFilter} priorityf={setPriorityFilter} currentDate={dateFilter} datef={setDateFilter} /> :
          null
        }
      </div>
      <div className="space-y-8 h-[calc(100%-16rem)] overflow-y-auto">
        {
          isLoading ? <span className="italic text-sm">Loading...</span> :
            (filteredTasks.length > 0 ?
              filteredTasks.map((d: TaskInterface, index: number) => <Task key={index} data={d} complete={handleCompleteTask} />) :
              <span className="italic text-sm">No task found, type create to add one</span>)
        }
      </div>
    </div>
  );
}