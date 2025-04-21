"use client";

import React from 'react';

import { cn } from '@/lib/utils';
import { SidebarTrigger, useSidebar } from '../ui/sidebar';
import Avatar from '../ui/avatar';

const AppHeader: React.FC = ({}) => {
    const { open, isMobile, openMobile } = useSidebar();

  return (
    <header className={cn("fixed top-0 flex items-center justify-start transition-all duration-300 left-0 right-0 h-[67px] z-10 bg-white/50 backdrop-blur-sm backdrop-saturate-200 border-b", {
      "ml-[16rem]": open,
      "ml-0": !open || isMobile,
    })}>
    <div className='flex items-center justify-between w-full px-4'>
    <div className="flex items-center justify-start gap-2">
    {
        !open && !isMobile && <SidebarTrigger />
    }
    {
        !openMobile && isMobile && <SidebarTrigger />
    }
      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <h1 className='text-2xl font-bold'>App Name</h1>
        </div>
      </div>
    </div>
    <Avatar />
    </div>
    </header>
  );
};

export default AppHeader;