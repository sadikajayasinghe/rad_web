import { request } from "./api"

export interface ChatMessage {
  role: "user" | "model"
  content: string
}

export interface ChatResponse {
  success: boolean
  reply: string
}

export const chatService = {
  sendMessage: (message: string, history: ChatMessage[] = []): Promise<ChatResponse> => {
    return request<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify({ message, history })
    })
  }
}
