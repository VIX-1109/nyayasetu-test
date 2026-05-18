/**
 * Secure messaging module contract.
 */

export const messageRepositoryContract = {
  listConversation: '(userId, otherUserId) => Promise<Message[]>',
  listNewMessages: '(userId, otherUserId, afterTimestamp) => Promise<Message[]>',
  sendMessage: '(SendMessageInput) => Promise<Message>',
  markConversationRead: '(receiverId, senderId) => Promise<void>',
  sendAdminWarning: '(adminId, userId, message) => Promise<void>'
};

export const sendMessageInput = {
  senderId: 'uuid',
  receiverId: 'uuid',
  content: 'string'
};
