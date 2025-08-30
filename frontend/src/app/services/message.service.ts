import { Injectable, signal } from '@angular/core';

import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  message = signal<Message>({
    msg: '',
    type: 'normal',
  });

  setMessage(msg: string, type: 'normal' | 'success' | 'error') {
    this.message.set({ msg, type });

    this.clearMessageAfterTime();
  }

  clearMessage() {
    this.message.set({ msg: '', type: 'normal' });
  }

  clearMessageAfterTime() {
    return setTimeout(() => {
      this.clearMessage();
    }, 3000);
  }
}
