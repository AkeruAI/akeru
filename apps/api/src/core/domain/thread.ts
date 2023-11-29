export interface Thread {
  createdBy: string; // The ID of the user who created the thread
  participants: string[]; // The IDs of the participants in the thread
  messageIds: string[]; // An array of the IDs of the messages in the thread
  startDate: Date; // The date when the thread was started
  id: string; // The ID of the thread
  relatedDocuments: string[]; // An array of the IDs of the documents related to the thread
}
