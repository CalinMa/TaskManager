import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const apiKey = environment.OPENAI_API_KEY;


@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private apiKey = apiKey;

  constructor(private http: HttpClient) {}

  getSuggestions(prompt: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      model: 'gpt-3.5-turbo', 
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
      temperature: 0.7,
      n: 1
    };

    return this.http.post<any>(this.apiUrl, body, { headers }).pipe(
      map(response => response.choices.map((choice: any) => choice.message.content.trim()))
    );
  }
}
