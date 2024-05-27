import React from "react";
import ThreadsList from "./features/thread-list/threads-list";
import AssistantsList from "./features/assistants-list/assistants-list";
import ConversationArea from "./features/conversation-area/conversation-area";

const ThreadsPage = () => {
  return (
    <div className="flex h-full flex-row gap-4">
      <div className="flex flex-row gap-2">
        <ThreadsList />
        <AssistantsList />
      </div>
      <ConversationArea/>
    </div>
  );
};

export default ThreadsPage;
