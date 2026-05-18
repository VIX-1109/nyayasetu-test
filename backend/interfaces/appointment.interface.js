/**
 * Consultation booking module contract.
 */

export const APPOINTMENT_STATUSES = ['pending', 'confirmed', 'cancelled'];

export const appointmentRepositoryContract = {
  listByClient: '(clientId) => Promise<Appointment[]>',
  listByAdvocate: '(advocateId) => Promise<Appointment[]>',
  createBookingRequest: '(CreateAppointmentInput) => Promise<Appointment>',
  updateAppointmentStatus: '(appointmentId, status) => Promise<void>'
};

export const createAppointmentInput = {
  clientId: 'uuid',
  advocateId: 'uuid',
  date: 'string',
  time: 'string',
  description: 'string'
};
