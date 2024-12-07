"use client"; // Este layout usa client-side features como interatividade

import Link from "next/link";
import { useRouter } from "next/navigation";
// import { useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminDashboardLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove o token JWT
    router.push("/admin/login"); // Redireciona para a página de login
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <h1 className="text-2xl font-bold">Administração</h1>
        </div>
        <nav className="flex flex-col p-4">
          <Link href="/admin/dashboard">Dashboard</Link>
          {/* Futuras Páginas como CMS e Relatórios podem ser adicionadas aqui */}
          <button
            onClick={handleLogout}
            className="mt-auto bg-red-500 hover:bg-red-600 p-2 rounded"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-gray-100 p-6">{children}</main>
    </div>
  );
}
