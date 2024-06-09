import React from "react";

export interface ThreadsListItemProps {
  title: string;
  description: string;
  date: string;
  isActive?: boolean;
}

const ThreadsListItem = (props: ThreadsListItemProps) => {
  return (
    <div
      className={`max-w-52 px-2 py-1 duration-200 hover:bg-gray-600/75 hover:text-white ${props.isActive && "bg-gray-600/75 text-white"}`}
    >
      <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm ">
        {props.title}
      </p>
    </div>
  );
};

export default ThreadsListItem;
