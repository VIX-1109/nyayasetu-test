/**
 * Advocate module contract.
 */

export const ADVOCATE_VERIFICATION_STATUSES = ['pending', 'verified'];

export const advocateRepositoryContract = {
  listVerifiedAdvocates: '(filters) => Promise<Advocate[]>',
  getAdvocateProfile: '(advocateId) => Promise<Advocate>',
  upsertAdvocateProfile: '(AdvocateProfileInput) => Promise<void>',
  listPendingAdvocates: '() => Promise<Advocate[]>',
  updateVerificationFlags: '(advocateId, flags) => Promise<void>'
};

export const advocateProfileInput = {
  id: 'uuid',
  barCouncilNumber: 'string',
  specializations: 'string[]',
  experienceYears: 'number',
  location: 'string',
  about: 'string',
  phone: 'string'
};
