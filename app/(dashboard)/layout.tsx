import { AppSideBar } from "@/components/AppSideBar/AppSideBar";
import DashboardNav from "@/components/DashboardNav/DashboardNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NotificationListener } from "@/components/NotificationListener/NotificationListener";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <NotificationListener />
      <SidebarProvider>
        <div className="border-r">
          <AppSideBar />
        </div>
        <main className="w-full">
          <DashboardNav />
          <div className="p-4 pt-6 bg-background min-h-screen">{children}</div>
        </main>
      </SidebarProvider>
    </main>
  );
}
