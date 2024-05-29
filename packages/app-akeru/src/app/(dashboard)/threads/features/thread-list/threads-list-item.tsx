import React from "react";

export interface ThreadsListItemProps {
  title: string;
  description: string;
  date: string;
  isActive?: boolean;
}

const ThreadsListItem = (props: ThreadsListItemProps) => {
  return (
    <div className="">
      <p className="overflow-hidden whitespace-nowrap text-sm">{props.title}</p>
    </div>
  );
};

export default ThreadsListItem;
