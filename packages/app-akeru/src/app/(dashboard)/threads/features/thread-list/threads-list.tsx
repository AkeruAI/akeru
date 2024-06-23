"use client";

import React, { useState, useEffect } from "react";
import { THREADS_LIST_MOCK_DATA } from "./test-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThreadsListItem, { ThreadsListItemProps } from "./threads-list-item";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useThreads from "./use-threads";
import { useThreadStore } from "./useThreadStore";
import { useRouter } from "next/navigation";

const ThreadsList = () => {
  const router = useRouter();
  const activeThread = useThreadStore((state) => state.activeId);
  const setActiveThread = useThreadStore((state) => state.setActiveId);

  const { isFetchingThreads, threads } = useThreads();

  const handleSetActiveId = (id: string) => {
    const parsedString = id.replace(/\s+/g, "-");
    setActiveThread(id);
    router.push(`/threads?${parsedString}`);
  };

  const isActive = (id: string) => id === activeThread;

  return (
    <div className="w-64 rounded-md bg-white p-4 shadow-md">
      <div className="mb-4 flex flex-col gap-2">
        <Input placeholder="Filter your threads..." startIcon={Search} />
      </div>
      <ScrollArea className="relative h-4/5 overflow-clip">
        {/* This is just for the overflow gradient */}
        <div className="pointer-events-none absolute right-0 top-0 h-4/5 w-8 bg-gradient-to-r from-transparent to-white"></div>
        {/* This is just for the overflow gradient */}
        <div className="flex flex-col gap-4">
          {isFetchingThreads
            ? Array.from({ length: THREADS_LIST_MOCK_DATA.length }).map(
                (_, idx) => <Skeleton key={idx} className="h-8" />,
              )
            : threads.map((thread: ThreadsListItemProps) => (
                <div
                  key={thread.id}
                  onClick={() => handleSetActiveId(thread.name.toLowerCase())}
                >
                  <ThreadsListItem
                    isActive={isActive(thread.name.toLowerCase())}
                    {...thread}
                  />
                </div>
              ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ThreadsList;
