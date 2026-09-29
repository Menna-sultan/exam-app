import { Sidebar } from "@/features/main/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   
      <div className="flex h-screen overflow-hidden">
  <Sidebar />
  <main className="flex-1 overflow-y-auto bg-[#F9FAFB]">{children}</main>
</div>

  );
}