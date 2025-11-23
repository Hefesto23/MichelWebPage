// src/app/admin/blocked-slots/page.tsx
import { BlockedSlotsManager } from '@/components/pages/admin/BlockedSlotsManager';

export const metadata = {
  title: 'Bloqueio de Horários | Admin',
  description: 'Gerenciar bloqueios de horários recorrentes e pontuais'
};

export default function BlockedSlotsPage() {
  return <BlockedSlotsManager />;
}
