"use client";
import { cn } from "@/lib/utils";
import { Bot, Home, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface NavBarItemProps {
  name: string;
  route: string;
  icon: LucideIcon;
}

const NAVBAR_ITEMS: NavBarItemProps[] = [
  {
    name: "Threads",
    route: "/threads",
    icon: Home,
  },
  {
    name: "Assistants",
    route: "/assistants",
    icon: Bot,
  },
];

const NavBarItem = (props: NavBarItemProps) => {
  const pathName = usePathname();

  return (
    <Link
      href={props.route}
      className={cn(
        "transform rounded-lg px-4 py-1 text-sm font-light text-slate-400 transition-colors duration-200 hover:text-slate-800 ",
        {
          "font-semibold text-slate-800 ": pathName === props.route,
        },
      )}
    >
      {props.name}
    </Link>
  );
};

const HeaderNavBar = () => {
  return (
    <nav className="inline-flex">
      {NAVBAR_ITEMS.map((item, key) => {
        return <NavBarItem key={item.name + key} {...item} />;
      })}
    </nav>
  );
};

export default HeaderNavBar;
