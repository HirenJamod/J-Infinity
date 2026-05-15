import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
