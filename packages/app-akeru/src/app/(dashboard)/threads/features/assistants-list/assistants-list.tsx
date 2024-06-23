"use client";
import React from "react";
import useAssistant from "./use-assistant";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/combobox";

const AssistantsList = () => {
  const { isFetchingAssistants, assistants } = useAssistant();
  return (
    <div
      className={cn("w-96 rounded-md bg-white p-4 shadow-md", {
        "animate-pulse": isFetchingAssistants,
      })}
    >
      <Combobox
        items={
          assistants?.map((assistant: any) => ({
            value: assistant.name,
            label: assistant.name,
          })) || []
        }
        placeholder="Select assistant"
        value={""}
        onChange={(value) => console.log(value)}
      />
    </div>
  );
};

export default AssistantsList;
