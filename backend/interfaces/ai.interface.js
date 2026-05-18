/**
 * AI legal learning module contract.
 */

export const aiServiceContract = {
  answerLegalQuestion: '(AskLegalQuestionInput) => Promise<LegalInformationAnswer>',
  saveQueryHistory: '(SaveAiQueryInput) => Promise<void>',
  recommendEscalation: '(question, answer) => Promise<AdvocateRecommendation[]>'
};

export const askLegalQuestionInput = {
  userId: 'uuid',
  question: 'string',
  locale: 'en-IN | hi-IN | mr-IN',
  sessionId: 'string | null'
};

export const saveAiQueryInput = {
  userId: 'uuid',
  question: 'string',
  answerSummary: 'string',
  category: 'string'
};
