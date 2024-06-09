"use client";
import React, { useState, useEffect } from "react";
import { THREADS_LIST_MOCK_DATA } from "./test-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThreadsListItem from "./threads-list-item";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ThreadsList = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };
    fetchData();
  }, []);

  const handleSetActiveId = (id: string) => {
    setActiveId(id);
  };

  const isActive = (id: string) => id === activeId;

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
          {isLoading
            ? Array.from({ length: THREADS_LIST_MOCK_DATA.length }).map(
                (_, idx) => <Skeleton key={idx} className="h-8" />,
              )
            : THREADS_LIST_MOCK_DATA.map((thread, key) => (
                <div
                  key={thread.title + key}
                  onClick={() => handleSetActiveId(thread.title.toLowerCase())}
                >
                  <ThreadsListItem
                    isActive={isActive(thread.title.toLowerCase())}
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
