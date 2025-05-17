import api from "./client";

export interface Message {
  id: number;
  sender_id: number;
  sender_type: "user" | "association";
  receiver_id: number;
  receiver_type: "user" | "association"; // ← NEW FIELD
  message_content: string;
  sent_at: string;
  read_at: string | null;
  sender?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_type?: "donor" | "recipient";
    name?: string; // For associations
  };
}

export interface Conversation {
  messages: Message[];
  association?: {
    id: number;
    name: string;
  };
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    user_type: "donor" | "recipient";
  };
}

/**
 * Get conversation between current user and an association
 * Works for both donor and recipient users
 */
export const getConversation = async (
  associationId: number
): Promise<Conversation> => {
  const response = await api.get(`/chat/association/${associationId}`);
  return response.data;
};

/**
 * Send message from user (donor/recipient) to association
 */
export const sendToAssociation = async (
  associationId: number,
  messageContent: string
): Promise<Message> => {
  const response = await api.post(`/chat/association/${associationId}/send`, {
    message_content: messageContent,
  });
  return response.data.message;
};

/**
 * Send message from association to user (donor/recipient)
 */
export const sendToUser = async (
  userId: number,
  messageContent: string
): Promise<Message> => {
  const response = await api.post(`/chat/user/${userId}/send`, {
    message_content: messageContent,
  });
  return response.data.message;
};

/**
 * Get all messages received by an association
 * (For association dashboard)
 */
export const getAssociationMessages = async (): Promise<{
  messages: Message[];
  total_unread: number;
}> => {
  const response = await api.get("/association/messages");
  return response.data;
};

/**
 * Get all messages received by a user
 * (For user dashboard)
 */
export const getUserMessages = async (): Promise<{
  messages: Message[];
  total_unread: number;
}> => {
  const response = await api.get("/user/messages");
  return response.data;
};

/**
 * Mark messages as read
 * Works for both user types and associations
 */
export const markMessagesAsRead = async (senderId: number): Promise<void> => {
  await api.post(`/chat/mark-read/${senderId}`);
};

// Type guards for user differentiation
export const isDonor = (user: { user_type?: string }): boolean => {
  return user?.user_type === "donor";
};

export const isRecipient = (user: { user_type?: string }): boolean => {
  return user?.user_type === "recipient";
};
