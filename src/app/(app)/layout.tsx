import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/BottomNav";
import { GlowOrb } from "@/components/ui/GlowOrb";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 10% 20%, #0d1225 0%, #090e1c 50%, #060a14 100%)",
      }}
    >
      <GlowOrb x="-120px" y="-100px" color="#4dc9f6" size="500px" />
      <GlowOrb x="55%" y="35%" color="#ff6eb4" size="450px" />
      <GlowOrb x="75%" y="-60px" color="#a78bfa" size="350px" />
      <GlowOrb x="20%" y="70%" color="#4dc9f6" size="300px" />

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
