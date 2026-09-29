import { AccountTabs } from "@/features/main/components/account/account-tabs";
import { Breadcrumb, PageHeader } from "@/features/main/components/layout/page-header";
import { User2 } from "lucide-react";

export default function AccountPage() {
  return (
    <div>
      <Breadcrumb items={["Account"]} />
      <PageHeader icon={User2} title="Account Settings" />
      <AccountTabs />
    </div>
  );
}