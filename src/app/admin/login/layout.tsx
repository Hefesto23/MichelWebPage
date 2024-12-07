"use client"; // Este layout usa client-side features como interatividade

interface AdminLayoutProps {
  children: React.ReactNode;
}
export default function AdminLoginLayout({ children }: AdminLayoutProps) {
  return (
    <html>
      <body>
        {/* Main Content */}
        <main className="flex-grow bg-gray-100 p-6">{children}</main>
      </body>
    </html>
  );
}
