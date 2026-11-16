import AdminWorkspace from "@/components/admin/AdminWorkspace";
export const metadata = {
  title: "Administration — ACV",
  robots: { index: false, follow: false },
};
export default function DashboardPage() {
  return <AdminWorkspace />;
}
