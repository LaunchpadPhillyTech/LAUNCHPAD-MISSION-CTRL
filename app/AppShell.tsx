"use client";
import Sidebar from "./components/sidebar";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <main className="min-h-screen bg-background">{children}</main>;
  }

  return (
    <div className="app-shell flex min-h-screen w-full">
      <aside className="sidebar flex-shrink-0 h-screen sticky top-0 z-40">
        <Sidebar />
      </aside>
      <main className="main-content flex flex-col flex-1 min-h-screen bg-[var(--background)]">
        {children}
      </main>
    </div>
  );
}
