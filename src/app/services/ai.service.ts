import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private backendApiUrl = 'http://localhost:3000/chat'; // Updated to call the backend endpoint

  constructor(private http: HttpClient) {}

  getSuggestions(prompt: string): Observable<any> {
    return this.http.post<any>(this.backendApiUrl, { prompt });
  }
}
