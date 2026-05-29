import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell min-h-screen" style={{ background: "var(--color-eggshell)" }}>
      <Navbar />
      <main
        className="app-main mx-auto pb-24 md:pb-12"
        style={{ maxWidth: "1200px", padding: "48px 24px 48px" }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
