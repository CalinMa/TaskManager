import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks';
  constructor(private http: HttpClient) { }

  getTasks(customerId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/${customerId}`);
}
getTask(id: number): Observable<Task> {
  return this.http.get<Task>(`${this.apiUrl}/${id}`);
}

addTask(task: Task): Observable<Task> {
  return this.http.post<Task>(this.apiUrl, task);
}

updateTask(task: Task): Observable<Task> {
  return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
}

deleteTask(id: number, customerId: string): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${id}?customerId=${customerId}`);
}
}
