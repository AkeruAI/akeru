/**
 * Represents a message in the system.
 */
export type Message = {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
};
