import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { ChatbotResponse, Chatbot } from '../models/chatbot.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private httpClient = inject(HttpClient);
  private MY_CHATBOT_API_KEY = environment.MY_CHATBOT_API_KEY;
  private CHATBOT_URL = environment.CHATBOT_URL;

  sendMessage(payload: Chatbot) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.MY_CHATBOT_API_KEY}`,
      'Content-Type': 'application/json',
    });

    return this.httpClient
      .post<ChatbotResponse>(this.CHATBOT_URL, payload, { headers })
      .pipe(
        map((response: ChatbotResponse) => {
          return response;
        }),
        catchError((error) => {
          return throwError(() => new Error('Failed to contact Chatbot: '));
        })
      );
  }
}
