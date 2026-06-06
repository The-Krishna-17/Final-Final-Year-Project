import { AppSideBar } from "@/components/AppSideBar/AppSideBar";
import DashboardNav from "@/components/DashboardNav/DashboardNav";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <SidebarProvider>
        <div className="border-r">
          <AppSideBar />
        </div>
        <main className="w-full">
          <DashboardNav />
          <div className="p-4 bg-muted min-h-screen">{children}</div>
        </main>
      </SidebarProvider>
    </main>
  );
}
