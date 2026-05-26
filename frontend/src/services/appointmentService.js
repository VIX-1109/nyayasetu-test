import { supabase } from '@/lib/supabaseClient';

const CLIENT_SELECT = '*, advocates(profiles(name))';
const ADVOCATE_SELECTS = [
  '*, profiles!client_id(name)',
  '*, profiles!appointments_client_id_fkey(name)',
  '*',
];

/** Normalize DB row for UI (supports date/time/description and scheduled_at/notes). */
export const normalizeAppointment = (row) => {
  if (!row) return row;

  const clientName =
    row.client_profile?.name ||
    row.profiles?.name ||
    null;

  let date = row.date;
  let time = row.time;
  let description = row.description || row.notes || '';

  if (row.scheduled_at) {
    const scheduled = new Date(row.scheduled_at);
    if (!Number.isNaN(scheduled.getTime())) {
      if (!date) date = scheduled.toISOString().split('T')[0];
      if (!time) time = scheduled.toTimeString().slice(0, 5);
    }
  }

  return {
    ...row,
    date,
    time,
    description,
    profiles: clientName ? { name: clientName } : row.profiles,
    advocates: row.advocates,
  };
};

const mapRows = (rows) => (rows || []).map(normalizeAppointment);

const attachClientNames = async (rows) => {
  if (!rows?.length) return rows;

  const clientIds = [...new Set(rows.map((row) => row.client_id).filter(Boolean))];
  if (!clientIds.length) return rows;

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, name')
    .in('id', clientIds);

  if (error) return rows;

  const nameById = new Map((profiles || []).map((profile) => [profile.id, profile.name]));
  return rows.map((row) => ({
    ...row,
    profiles: { name: nameById.get(row.client_id) || 'Citizen' },
  }));
};

const attachAdvocateNames = async (rows) => {
  if (!rows?.length) return rows;

  const advocateIds = [...new Set(rows.map((row) => row.advocate_id).filter(Boolean))];
  if (!advocateIds.length) return rows;

  const { data: advocates, error } = await supabase
    .from('advocates')
    .select('id, profiles(name)')
    .in('id', advocateIds);

  if (error) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name')
      .in('id', advocateIds);

    const nameById = new Map((profiles || []).map((profile) => [profile.id, profile.name]));
    return rows.map((row) => ({
      ...row,
      advocates: { profiles: { name: nameById.get(row.advocate_id) || 'Advocate' } },
    }));
  }

  const advocateById = new Map((advocates || []).map((adv) => [adv.id, adv]));
  return rows.map((row) => ({
    ...row,
    advocates: advocateById.get(row.advocate_id) || { profiles: { name: 'Advocate' } },
  }));
};

const fetchAdvocateAppointments = async (advocateId) => {
  for (const selectQuery of ADVOCATE_SELECTS) {
    const { data, error } = await supabase
      .from('appointments')
      .select(selectQuery)
      .eq('advocate_id', advocateId)
      .order('created_at', { ascending: false });

    if (!error) {
      const rows = selectQuery === '*' ? await attachClientNames(data) : data;
      return mapRows(rows);
    }
  }

  throw new Error('Unable to load consultation requests');
};

const fetchClientAppointments = async (clientId) => {
  const { data, error } = await supabase
    .from('appointments')
    .select(CLIENT_SELECT)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (!error) {
    return mapRows(data);
  }

  const { data: fallbackRows, error: fallbackError } = await supabase
    .from('appointments')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (fallbackError) throw fallbackError;

  const enriched = await attachAdvocateNames(fallbackRows);
  return mapRows(enriched);
};

export const getAppointmentsByClient = async (clientId) => {
  return fetchClientAppointments(clientId);
};

export const getAppointmentsByAdvocate = async (advocateId) => {
  return fetchAdvocateAppointments(advocateId);
};

export const createAppointment = async (payload) => {
  const attempts = [
    {
      advocate_id: payload.advocate_id,
      client_id: payload.client_id,
      date: payload.date,
      time: payload.time,
      description: payload.description || payload.notes,
      status: payload.status || 'pending',
    },
    {
      advocate_id: payload.advocate_id,
      client_id: payload.client_id,
      scheduled_at: payload.scheduled_at,
      mode: payload.mode || 'online',
      notes: payload.notes || payload.description,
      status: payload.status || 'pending',
    },
    { ...payload },
  ];

  let lastError = null;

  for (const attempt of attempts) {
    const cleaned = Object.fromEntries(
      Object.entries(attempt).filter(([, value]) => value !== undefined && value !== '')
    );

    const { data, error } = await supabase
      .from('appointments')
      .insert(cleaned)
      .select('id')
      .single();

    if (!error) return data;
    lastError = error;
  }

  throw lastError || new Error('Failed to create appointment');
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  if (!appointmentId || String(appointmentId).startsWith('offline-')) {
    return;
  }

  const { error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', appointmentId);

  if (error) throw error;
};
