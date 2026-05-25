import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-eggshell)" }}>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
