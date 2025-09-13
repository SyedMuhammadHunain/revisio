import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Messages {
  content: string;
  time: string;
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

  botResponses: string[] = [
    "I'm here to help! What can I do for you?",
    'Can you please provide more details?',
    'Let me check that for you.',
    "That's interesting! Tell me more.",
    'How can I assist you further?',
    "I'm happy to help with your coding problem.",
    'Could you clarify your question?',
    "Let's solve this together!",
    'Feel free to ask me anything.',
    'Is there something specific you need help with?',
  ];

  onSendIcon() {
    if (this.userMessage.trim()) {
      // Add user message
      this.messages.push({
        content: this.userMessage,
        time: this.getCurrentTime(),
        isUser: true,
      });

      // Clear input
      this.userMessage = '';
      this.isBotTyping.set(true);

      // API
      

      // Add bot response after delay
      setTimeout(() => {
        this.messages.push({
          content: 'Thank you for your message! How else can I help you?',
          time: this.getCurrentTime(),
          isUser: false,
        });
        this.isBotTyping.set(false);
      }, 1500);
    }
  }

  getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
