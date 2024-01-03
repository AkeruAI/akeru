export type Thread = {
  id: string; // The ID of the thread
  createdBy: string; // The ID of the user who created the thread
  startDate?: Date; // The start date of the thread
  participants: string[]; // The IDs of the users participating in the thread
  messageIds: string[]; // The IDs of the messages in the thread
};
