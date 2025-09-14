export interface Chatbot {
  conversationHistory: {
    role: Role;
    content: string;
  }[];
  modelAPIKey: string;
  userNewMessage: string;
}

export interface ChatbotResponse {
  status: boolean;
  reply: string;
}

export enum Role {
  user = 'user',
  bot = 'bot',
}
