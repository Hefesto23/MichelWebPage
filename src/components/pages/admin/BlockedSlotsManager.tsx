// src/components/pages/admin/BlockedSlotsManager.tsx
"use client";
import { useState, useEffect } from 'react';
import { getToken } from '@/lib/auth';
import { BlockedSlot, DAY_OF_WEEK_MAP } from '@/types/blocked-slot';
import { APPOINTMENT } from '@/utils/constants';
import { Calendar, Clock, Trash2, Power, PowerOff, Plus, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const BlockedSlotsManager = () => {
  const [tab, setTab] = useState<'recurring' | 'onetime'>('recurring');
  const [blocks, setBlocks] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state for RECURRING blocks
  const [recurringForm, setRecurringForm] = useState({
    dayOfWeek: 1,
    timeSlot: '09:00',
    reason: ''
  });

  // Form state for ONE_TIME blocks
  const [oneTimeForm, setOneTimeForm] = useState({
    specificDate: '',
    timeSlot: '09:00',
    reason: ''
  });

  // Load blocks on mount and tab change
  useEffect(() => {
    loadBlocks();
  }, [tab]);

  const loadBlocks = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const blockTypeFilter = tab === 'recurring' ? 'RECURRING' : 'ONE_TIME';

      const response = await fetch(`/api/admin/blocked-slots?type=${blockTypeFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Erro ao carregar bloqueios');

      const data = await response.json();
      setBlocks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create RECURRING block
  const createRecurringBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = getToken();
      const response = await fetch('/api/admin/blocked-slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          blockType: 'RECURRING',
          ...recurringForm
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar bloqueio');
      }

      setSuccess('Bloqueio recorrente criado com sucesso!');
      setRecurringForm({ dayOfWeek: 1, timeSlot: '09:00', reason: '' });
      loadBlocks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Create ONE_TIME block
  const createOneTimeBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!oneTimeForm.specificDate) {
      setError('Selecione uma data');
      return;
    }

    try {
      const token = getToken();
      const response = await fetch('/api/admin/blocked-slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          blockType: 'ONE_TIME',
          ...oneTimeForm
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar bloqueio');
      }

      setSuccess('Bloqueio pontual criado com sucesso!');
      setOneTimeForm({ specificDate: '', timeSlot: '09:00', reason: '' });
      loadBlocks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Toggle active status
  const toggleBlock = async (id: string, currentStatus: boolean) => {
    try {
      const token = getToken();
      const response = await fetch(`/api/admin/blocked-slots/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (!response.ok) throw new Error('Erro ao atualizar bloqueio');

      loadBlocks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete block
  const deleteBlock = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este bloqueio?')) return;

    try {
      const token = getToken();
      const response = await fetch(`/api/admin/blocked-slots/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Erro ao deletar bloqueio');

      setSuccess('Bloqueio deletado com sucesso!');
      loadBlocks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-foreground">Bloqueio de Horários</h1>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg">
          <p className="text-green-700 dark:text-green-300">{success}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setTab('recurring')}
          className={`px-6 py-3 font-medium transition-colors ${
            tab === 'recurring'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Calendar className="w-5 h-5 inline mr-2" />
          Bloqueios Recorrentes
        </button>
        <button
          onClick={() => setTab('onetime')}
          className={`px-6 py-3 font-medium transition-colors ${
            tab === 'onetime'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Clock className="w-5 h-5 inline mr-2" />
          Bloqueios Pontuais
        </button>
      </div>

      {/* Recurring Tab */}
      {tab === 'recurring' && (
        <div>
          {/* Create Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Criar Bloqueio Recorrente</h2>
            <form onSubmit={createRecurringBlock} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Dia da Semana</label>
                <select
                  value={recurringForm.dayOfWeek}
                  onChange={(e) => setRecurringForm({ ...recurringForm, dayOfWeek: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded bg-background text-foreground"
                  required
                >
                  {Object.entries(DAY_OF_WEEK_MAP).map(([num, name]) => (
                    <option key={num} value={num}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Horário</label>
                <select
                  value={recurringForm.timeSlot}
                  onChange={(e) => setRecurringForm({ ...recurringForm, timeSlot: e.target.value })}
                  className="w-full p-2 border rounded bg-background text-foreground"
                  required
                >
                  {APPOINTMENT.TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Motivo (opcional)</label>
                <input
                  type="text"
                  value={recurringForm.reason}
                  onChange={(e) => setRecurringForm({ ...recurringForm, reason: e.target.value })}
                  placeholder="Ex: Reunião semanal"
                  className="w-full p-2 border rounded bg-background text-foreground"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Criar Bloqueio
                </button>
              </div>
            </form>
          </div>

          {/* List */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Bloqueios Recorrentes Ativos</h2>
            {loading ? (
              <p className="text-gray-500">Carregando...</p>
            ) : blocks.length === 0 ? (
              <p className="text-gray-500">Nenhum bloqueio recorrente cadastrado</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-foreground">Dia</th>
                      <th className="px-4 py-3 text-left text-foreground">Horário</th>
                      <th className="px-4 py-3 text-left text-foreground">Motivo</th>
                      <th className="px-4 py-3 text-left text-foreground">Status</th>
                      <th className="px-4 py-3 text-center text-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {blocks.map(block => (
                      <tr key={block.id} className={!block.isActive ? 'opacity-50' : ''}>
                        <td className="px-4 py-3 text-foreground">{DAY_OF_WEEK_MAP[block.dayOfWeek!]}</td>
                        <td className="px-4 py-3 text-foreground font-mono">{block.timeSlot}</td>
                        <td className="px-4 py-3 text-foreground">{block.reason || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            block.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {block.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => toggleBlock(block.id, block.isActive)}
                              className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                block.isActive ? 'text-green-600' : 'text-gray-400'
                              }`}
                              title={block.isActive ? 'Desativar' : 'Ativar'}
                            >
                              {block.isActive ? <Power className="w-5 h-5" /> : <PowerOff className="w-5 h-5" />}
                            </button>
                            <button
                              onClick={() => deleteBlock(block.id)}
                              className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                              title="Deletar"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* One-Time Tab */}
      {tab === 'onetime' && (
        <div>
          {/* Create Form */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Criar Bloqueio Pontual</h2>
            <form onSubmit={createOneTimeBlock} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Data</label>
                <input
                  type="date"
                  value={oneTimeForm.specificDate}
                  onChange={(e) => setOneTimeForm({ ...oneTimeForm, specificDate: e.target.value })}
                  className="w-full p-2 border rounded bg-background text-foreground"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Horário</label>
                <select
                  value={oneTimeForm.timeSlot}
                  onChange={(e) => setOneTimeForm({ ...oneTimeForm, timeSlot: e.target.value })}
                  className="w-full p-2 border rounded bg-background text-foreground"
                  required
                >
                  {APPOINTMENT.TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Motivo (opcional)</label>
                <input
                  type="text"
                  value={oneTimeForm.reason}
                  onChange={(e) => setOneTimeForm({ ...oneTimeForm, reason: e.target.value })}
                  placeholder="Ex: Feriado"
                  className="w-full p-2 border rounded bg-background text-foreground"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Criar Bloqueio
                </button>
              </div>
            </form>
          </div>

          {/* List */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Próximos Bloqueios Pontuais</h2>
            {loading ? (
              <p className="text-gray-500">Carregando...</p>
            ) : blocks.length === 0 ? (
              <p className="text-gray-500">Nenhum bloqueio pontual cadastrado</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-foreground">Data</th>
                      <th className="px-4 py-3 text-left text-foreground">Horário</th>
                      <th className="px-4 py-3 text-left text-foreground">Motivo</th>
                      <th className="px-4 py-3 text-left text-foreground">Status</th>
                      <th className="px-4 py-3 text-center text-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {blocks.map(block => (
                      <tr key={block.id} className={!block.isActive ? 'opacity-50' : ''}>
                        <td className="px-4 py-3 text-foreground">
                          {block.specificDate && format(new Date(block.specificDate), "dd/MM/yyyy", { locale: ptBR })}
                        </td>
                        <td className="px-4 py-3 text-foreground font-mono">{block.timeSlot}</td>
                        <td className="px-4 py-3 text-foreground">{block.reason || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            block.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {block.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => toggleBlock(block.id, block.isActive)}
                              className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                                block.isActive ? 'text-green-600' : 'text-gray-400'
                              }`}
                              title={block.isActive ? 'Desativar' : 'Ativar'}
                            >
                              {block.isActive ? <Power className="w-5 h-5" /> : <PowerOff className="w-5 h-5" />}
                            </button>
                            <button
                              onClick={() => deleteBlock(block.id)}
                              className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition-colors"
                              title="Deletar"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
