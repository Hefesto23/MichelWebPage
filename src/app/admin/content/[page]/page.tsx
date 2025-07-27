// ============================================
// 7. src/app/admin/content/[page]/page.tsx
// ============================================
"use client";

import { PageEditor } from "@/components/pages/admin";
import { useParams } from "next/navigation";

export default function PageEditorPage() {
  const params = useParams();
  const page = params.page as string;

  return <PageEditor page={page} />;
}
