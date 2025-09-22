// chatbot.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chatbot, ChatbotResponse, Role } from '../../models/chatbot.model';
import { ChatbotService } from '../../services/chatbot.service';
import { environment } from '../../environments/environment';

interface Messages {
  content: string;
  time: Date;
  isUser: boolean;
}

@Component({
  selector: 'app-chatbot',
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
})
export class ChatbotComponent {
  userMessage: string = '';
  messages: Messages[] = [];
  isBotTyping = signal<boolean>(false);
  private MODEL_API_KEY = environment.MODEL_API_KEY;
  private chatbotService = inject(ChatbotService);

  onSendIcon() {
    if (this.userMessage.trim()) {
      const currentMessage = this.userMessage.trim();

      // Add user message to UI
      this.messages.push({
        content: currentMessage,
        time: new Date(),
        isUser: true,
      });

      const payload: Chatbot = {
        conversationHistory: this.messages.map((msg) => ({
          role: msg.isUser ? Role.user : Role.bot,
          content: msg.content,
        })),
        modelAPIKey: this.MODEL_API_KEY,
        userNewMessage: this.userMessage,
      };

      this.isBotTyping.set(true);

      this.chatbotService.sendMessage(payload).subscribe({
        next: (response: ChatbotResponse) => {
          this.messages.push({
            content: response.reply,
            time: new Date(),
            isUser: false,
          });
          this.isBotTyping.set(false);
        },
        error: () => {
          this.messages.push({
            content: 'Sorry, something went wrong. Please try again.',
            time: new Date(),
            isUser: false,
          });
          this.isBotTyping.set(false);
        },
      });
      this.userMessage = '';
    }
  }
}
