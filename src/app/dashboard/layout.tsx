import { Sidebar } from "@/features/dashboard/components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100 font-mono text-slate-900">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}


