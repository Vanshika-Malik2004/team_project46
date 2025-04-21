"use client";

import {
  BarChartIcon,
  FolderIcon,
  LayoutDashboardIcon,
  ListIcon,
  LogOut,
  UsersIcon,
} from "lucide-react";

import { Logo } from "@/components/logo";
import NavMain from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/authContext";

import { useRouter } from "next/navigation";
import { useContext } from "react";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const sidebarItems = [
  {
    title: "Upload Image",
    url: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Find a Dermatologist",
    url: "dashboard/findDermatologist",
    icon: ListIcon,
  },
  {
    title: "Progress Tracker",
    url: "/dashboard/progressTracker",
    icon: BarChartIcon,
  },
];

const AppSidebar = ({ ...props }) => {
  const router = useRouter();
  const { open } = useSidebar();
  const { getUser, signOutUser } = useContext(AuthContext);
  const handleLogout = () => {
    signOutUser();
    toast.success("Signed out successfully!");
    router.push("/login");
  };
  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b">
        <SidebarMenu className="flex flex-row items-center justify-between px-4 py-2">
          <Logo />
          {open && <SidebarTrigger />}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarItems} />
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={handleLogout} className="w-full px-3 py-1.5">
          <LogOut className="h-4 w-4" />
          <span className="ml-2">Sign Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
