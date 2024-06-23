import { cn } from "@/lib/utils";
import React from "react";

export interface ThreadsListItemProps {
  id: string;
  name: string;
  createdBy?: string;
  participants?: string[];
  messageIds?: string[];
  isActive?: boolean;
}

const ThreadsListItem = (props: ThreadsListItemProps) => {
  return (
    <div
      className={cn(
        "max-w-52 px-2 py-1 duration-200 hover:bg-gray-600/75 hover:text-white",
        { "bg-gray-600/75 text-white": props.isActive },
      )}
    >
      <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm ">
        {props.name}
      </p>
    </div>
  );
};

export default ThreadsListItem;
