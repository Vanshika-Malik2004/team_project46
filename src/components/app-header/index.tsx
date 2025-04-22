"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import Avatar from "../ui/avatar";

const AppHeader: React.FC = ({}) => {
  const { open, isMobile, openMobile } = useSidebar();

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-10 flex h-[67px] items-center justify-start border-b bg-white/50 backdrop-blur-sm backdrop-saturate-200 transition-all duration-300",
        {
          "ml-[16rem]": open,
          "ml-0": !open || isMobile,
        }
      )}
    >
      <div className="flex w-full items-center justify-between px-4">
        <div className="flex items-center justify-start gap-2">
          {!open && !isMobile && <SidebarTrigger />}
          {!openMobile && isMobile && <SidebarTrigger />}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Welcome to radient</h1>
            </div>
          </div>
        </div>
        <Avatar />
      </div>
    </header>
  );
};

export default AppHeader;
