import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-message',
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
})
export class MessageComponent {
  private messageService = inject(MessageService);

  message$ = this.messageService.message;
}
