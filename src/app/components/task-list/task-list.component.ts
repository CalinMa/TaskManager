import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { AiService } from '../../services/ai.service'
import { LogoutService } from '../../services/logout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  displayedColumns: string[] = ['title', 'description', 'completed', 'actions'];
  editingTaskId: number | null = null;

  taskKeyword: string = ''; // User input for suggestions
  suggestedTasks: string='';
  isLoading = false;

  constructor(
    private taskService: TaskService, 
    private aiService: AiService, 
    private dialog: MatDialog,
    private logoutService: LogoutService,
    private router: Router
    ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  enableEdit(taskId: number): void {
    this.editingTaskId = taskId;
  }

  saveEdit(task: Task): void {
   
    this.taskService.updateTask(task).subscribe(() => {
      this.editingTaskId = null;
      this.loadTasks();
    });
  }

  cancelEdit(): void {
  
    this.editingTaskId = null;
    this.loadTasks();
  }

  confirmDelete(taskId: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result ) {
        this.taskService.deleteTask(taskId).subscribe(() => {
          this.loadTasks();
        });
      }
    });
  }

 
  generateSuggestions(): void {
    this.isLoading = true;

    const prompt = `Suggest one daily task related to ${this.taskKeyword}. The answer must have a title, followed by ':' and then a description. No more than 50 chars`;
  
    this.aiService.getSuggestions(prompt).subscribe({
      next: (response) => {
        console.log('Full API Response:', typeof response.model);
        this.suggestedTasks= response
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching suggestions:', error);
      }
    });
  }
  
  addSuggestedTask(suggesttion: string): void {
   
    const content = suggesttion.trim();
    const [title, description] = content.split(':').map(part => part.trim())
    this.taskService.addTask({
      title: title, 
      description: description,
      completed: false
    }).subscribe(addedTask => {
      this.tasks.push(addedTask);
      this.loadTasks();
    });
  }
  logout(): void {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No token found in local storage.');
      return;
    }

    this.logoutService.logout(token).subscribe({
      next: () => {
      
        // Redirect to login page
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        alert('An error occurred during logout. Please try again.');
      },
    });
  }
}
