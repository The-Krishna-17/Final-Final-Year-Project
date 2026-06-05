import { AppSideBar } from "@/components/AppSideBar/AppSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

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
        <main>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </main>
  );
}
