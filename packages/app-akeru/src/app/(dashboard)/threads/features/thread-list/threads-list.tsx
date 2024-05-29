import React from "react";
import { THREADS_LIST_MOCK_DATA } from "./test-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThreadsListItem from "./threads-list-item";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ThreadsList = () => {
  return (
    <div className="w-64 rounded-md bg-white p-4 shadow-md">
      <div className="mb-4 flex flex-col gap-2">
        <Input placeholder="Filter your threads..." startIcon={Search} />
      </div>
      <ScrollArea className="relative h-4/5 overflow-clip">
        {/* This is just for the overflow gradient  */}
        <div className="pointer-events-none absolute right-0 top-0 h-4/5 w-8 bg-gradient-to-r from-transparent to-white"></div>
        {/* This is just for the overflow gradient  */}
        <div className="flex flex-col gap-4">
          {THREADS_LIST_MOCK_DATA.map((thread, key) => {
            return <ThreadsListItem key={thread.title + key} {...thread} />;
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ThreadsList;
