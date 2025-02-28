import React from "react";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-[100dvh] flex flex-col justify-between gap-0">
      <Header />
      {children}
      <MobileNav />
    </div>
  );
}
