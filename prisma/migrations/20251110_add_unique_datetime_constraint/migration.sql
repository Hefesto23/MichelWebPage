-- CreateIndex: Constraint unique para prevenir agendamentos duplicados
-- Impede que dois agendamentos ocupem o mesmo horário
CREATE UNIQUE INDEX "unique_datetime_slot" ON "Appointment"("dataSelecionada", "horarioSelecionado");

-- CreateIndex: Índice para otimizar queries de busca de horários
CREATE INDEX "idx_appointment_datetime_status" ON "Appointment"("dataSelecionada", "horarioSelecionado", "status");
