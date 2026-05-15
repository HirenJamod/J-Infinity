import PortalSidebar from "@/components/PortalSidebar";

export default function PortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="admin-layout">
      <PortalSidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
