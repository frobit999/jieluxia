import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 10% 20%, #0d2d4a 0%, #081828 50%, #050f1a 100%)",
      }}
    >
      <GlowOrb x="-100px" y="-80px" color="#1a5fa0" size="500px" />
      <GlowOrb x="60%" y="40%" color="#0d3f6e" size="400px" />
      <GlowOrb x="80%" y="-50px" color="#1a3c6b" size="350px" />

      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 pb-24 lg:pb-8 overflow-y-auto">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
