import React from "react";
import Header from "../features/app-header/header";
import { Separator } from "@/components/ui/separator";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <Separator orientation="horizontal" />
      <div className="flex-grow overflow-scroll p-5">{children}</div>
    </div>
  );
};

export default DashboardLayout;
