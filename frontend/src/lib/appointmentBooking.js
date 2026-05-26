const MODE_MAP = {
  Chat: 'online',
  Video: 'online',
  Phone: 'phone',
  'In-person': 'in_person',
};

export const buildAppointmentPayload = ({
  advocateId,
  clientId,
  date,
  time,
  mode,
  intakeDescription,
}) => {
  const scheduledAt =
    date && time
      ? new Date(`${date}T${time}`).toISOString()
      : date
        ? new Date(`${date}T12:00:00`).toISOString()
        : new Date().toISOString();

  const dbMode = MODE_MAP[mode] || 'online';

  return {
    advocate_id: advocateId,
    client_id: clientId,
    status: 'pending',
    date,
    time,
    description: intakeDescription,
    scheduled_at: scheduledAt,
    mode: dbMode,
    notes: intakeDescription,
  };
};
